
'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Loader2, PlusCircle, Trash2, Wand2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useDoc, useMemoFirebase, useFirestore, useUser } from '@/firebase';
import type { Service, Package } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  itemType: z.enum(['service', 'package']),
  name: z.string().min(3, 'Name is required.'),
  slug: z.string().optional(),
  description: z.string().min(10, 'Description is required.'),
  // Service fields
  category: z.string().optional(),
  price: z.coerce.number().positive('Price must be a positive number.').optional(),
  priceType: z.enum(['starting', 'fixed']).optional(),
  deliveryTime: z.string().optional(),
  inclusions: z.array(z.object({ value: z.string() })).optional(),
  // Package fields
  priceString: z.string().optional(),
  features: z.array(z.object({ value: z.string() })).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const serviceCategories = [
    'invitation-videos',
    'invitation-cards',
    'video-editing',
    'album-design'
];

type CombinedDoc = Service | Package;

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const { slug } = params;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [itemType, setItemType] = useState<'service' | 'package' | null>(null);
  const { user } = useUser();
  const db = useFirestore();

  // Try fetching as a service first
  const serviceRef = useMemoFirebase(() => slug && db ? doc(db, 'services', slug as string) : null, [slug, db]);
  const { data: serviceData, isLoading: isServiceLoading } = useDoc<Service>(serviceRef);
  
  // Then try fetching as a package
  const packageRef = useMemoFirebase(() => slug && db ? doc(db, 'comboPackages', slug as string) : null, [slug, db]);
  const { data: packageData, isLoading: isPackageLoading } = useDoc<Package>(packageRef);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { fields: inclusionFields, append: appendInclusion, remove: removeInclusion } = useFieldArray({
    control: form.control,
    name: "inclusions",
  });
   const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control: form.control,
    name: "features",
  });
  
  useEffect(() => {
    let itemData: CombinedDoc | null = null;
    let type: 'service' | 'package' | null = null;

    if (serviceData) {
      itemData = serviceData;
      type = 'service';
    } else if (packageData) {
      itemData = packageData;
      type = 'package';
    }

    if (itemData && type) {
        setItemType(type);
        form.reset({
            itemType: type,
            name: itemData.name || '',
            slug: (itemData as Service).slug || '',
            description: itemData.description || '',
            category: (itemData as Service).category || undefined,
            price: (itemData as Service).price || undefined,
            priceType: (itemData as Service).priceType || 'fixed',
            deliveryTime: (itemData as Service).deliveryTime || undefined,
            inclusions: (itemData as Service).inclusions?.map(value => ({ value })) || [{ value: '' }],
            priceString: (itemData as Package).price || undefined,
            features: (itemData as Package).features?.map(value => ({ value })) || [{ value: '' }],
        });
    }
  }, [serviceData, packageData, form]);

    const handleGenerateDescription = async () => {
        setIsGenerating(true);
        toast({
            title: 'Feature Unavailable',
            description: 'The AI description generator is temporarily disabled.',
            variant: 'destructive',
        });
        setIsGenerating(false);
  };


  async function onSubmit(values: FormValues) {
    if (!user || !db) {
        toast({ title: 'Authentication Error', description: 'You must be logged in.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);

    try {
        if (values.itemType === 'service') {
            const serviceDocRef = doc(db, 'services', slug as string);
            await updateDoc(serviceDocRef, {
                name: values.name,
                description: values.description,
                category: values.category,
                price: values.price,
                priceType: values.priceType,
                deliveryTime: values.deliveryTime,
                inclusions: values.inclusions?.map(i => i.value).filter(Boolean),
            });
        } else { // package
            const packageDocRef = doc(db, 'comboPackages', slug as string);
            await updateDoc(packageDocRef, {
                name: values.name,
                description: values.description,
                price: values.priceString,
                features: values.features?.map(f => f.value).filter(Boolean),
            });
        }

        toast({
            title: 'Success!',
            description: `${values.itemType === 'service' ? 'Service' : 'Package'} updated successfully.`,
        });
        router.push('/admin/services');
        router.refresh();
    } catch (error: any) {
        toast({
            title: 'Error',
            description: error.message || 'Something went wrong.',
            variant: 'destructive',
        });
    }

    setIsLoading(false);
  }

  if (isServiceLoading || isPackageLoading) {
    return <div className="p-4 md:p-8"><Card className="max-w-3xl mx-auto"><CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader><CardContent><div className="space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-20 w-full" /><Skeleton className="h-10 w-full" /></div></CardContent></Card></div>
  }

  if (!itemType) {
    return <div className="p-4 md:p-8 text-center">Item not found.</div>
  }

  return (
    <div className="p-4 md:p-8 animate-fade-in-up">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit {itemType === 'service' ? 'Service' : 'Package'}</CardTitle>
          <CardDescription>Update the details for "{form.getValues('name')}".</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g. Elegant Wedding E-Invite" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              
              <div className="relative">
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea placeholder="Describe the item..." {...field} rows={4} /></FormControl>
                      <FormMessage />
                  </FormItem>
                )}/>
                <div className="absolute -bottom-6 right-0">
                    <Button type="button" variant="ghost" size="sm" onClick={handleGenerateDescription} disabled={isGenerating}>
                      {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                      Generate with AI
                    </Button>
                  </div>
              </div>


              {itemType === 'service' ? (
                <>
                    <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl><SelectContent>
                            {serviceCategories.map(cat => <SelectItem key={cat} value={cat}>{cat.replace('-', ' ')}</SelectItem>)}
                        </SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem><FormLabel>Price (INR)</FormLabel><FormControl><Input type="number" placeholder="e.g. 800" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="priceType" render={({ field }) => (
                            <FormItem><FormLabel>Price Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select price type" /></SelectTrigger></FormControl><SelectContent>
                                <SelectItem value="fixed">Fixed</SelectItem><SelectItem value="starting">Starting From</SelectItem>
                            </SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                    </div>
                     <FormField control={form.control} name="deliveryTime" render={({ field }) => (
                        <FormItem><FormLabel>Delivery Time</FormLabel><FormControl><Input placeholder="e.g. 1-2 Business Days" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div>
                        <FormLabel>Inclusions</FormLabel>
                        {inclusionFields.map((field, index) => (
                           <div key={field.id} className="flex items-center gap-2 mt-2">
                                <Input {...form.register(`inclusions.${index}.value` as const)} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeInclusion(index)}><Trash2 className="h-4 w-4" /></Button>
                           </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendInclusion({ value: "" })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Inclusion
                        </Button>
                    </div>
                </>
              ) : ( // Package fields
                <>
                    <FormField control={form.control} name="priceString" render={({ field }) => (
                        <FormItem><FormLabel>Price (Text)</FormLabel><FormControl><Input placeholder="e.g. ₹2,999" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <div>
                        <FormLabel>Features</FormLabel>
                        {featureFields.map((field, index) => (
                           <div key={field.id} className="flex items-center gap-2 mt-2">
                                <Input {...form.register(`features.${index}.value` as const)} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeFeature(index)}><Trash2 className="h-4 w-4" /></Button>
                           </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendFeature({ value: "" })}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                        </Button>
                    </div>
                </>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
