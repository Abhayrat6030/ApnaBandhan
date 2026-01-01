
'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';

const formSchema = z.object({
  itemType: z.enum(['service', 'package']),
  // Service fields
  name: z.string().min(3, 'Name is required.'),
  slug: z.string().min(3, 'Slug is required. Use format: "your-service-name"').optional(),
  category: z.string().optional(),
  description: z.string().min(10, 'Description is required.'),
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

export default function NewServicePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [itemType, setItemType] = useState('service');
  const { user } = useUser();
  const db = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemType: 'service',
      name: '',
      slug: '',
      description: '',
      price: 0,
      priceType: 'fixed',
      deliveryTime: '',
      inclusions: [{ value: '' }],
      priceString: '₹',
      features: [{ value: '' }],
    },
  });

  const { fields: inclusionFields, append: appendInclusion, remove: removeInclusion } = useFieldArray({
    control: form.control,
    name: "inclusions",
  });
   const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const handleItemTypeChange = (value: string) => {
    setItemType(value);
    form.setValue('itemType', value as 'service' | 'package');
  }

  async function onSubmit(values: FormValues) {
    if (!user || !db) {
        toast({ title: 'Error', description: 'You must be logged in to perform this action.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);

    try {
        if (values.itemType === 'service' && values.slug) {
            const serviceRef = doc(db, 'services', values.slug);
            await setDoc(serviceRef, {
                name: values.name,
                slug: values.slug,
                description: values.description,
                category: values.category,
                price: values.price,
                priceType: values.priceType,
                deliveryTime: values.deliveryTime,
                inclusions: values.inclusions?.map(i => i.value).filter(Boolean)
            });
        } else if (values.itemType === 'package') {
            const slug = values.name.toLowerCase().replace(/\s+/g, '-');
            const packageRef = doc(db, 'comboPackages', slug);
            await setDoc(packageRef, {
                name: values.name,
                description: values.description,
                price: values.priceString,
                features: values.features?.map(f => f.value).filter(Boolean),
            });
        }
        toast({
            title: 'Success!',
            description: `${values.itemType === 'service' ? 'Service' : 'Package'} added successfully.`,
        });
        router.push('/admin/services');

    } catch (error: any) {
        console.error("Error adding service:", error);
        toast({
            title: 'Error',
            description: error.message || 'Something went wrong.',
            variant: 'destructive',
        });
    }


    setIsLoading(false);
  }

  return (
    <div className="p-4 md:p-8 animate-fade-in-up">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Item</CardTitle>
          <CardDescription>Add a new service or combo package to your website.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="itemType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Type</FormLabel>
                    <Select onValueChange={handleItemTypeChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="package">Combo Package</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g. Elegant Wedding E-Invite" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              
              {itemType === 'service' && <FormField control={form.control} name="slug" render={({ field }) => (
                <FormItem><FormLabel>Slug</FormLabel><FormControl><Input placeholder="e.g. elegant-wedding-e-invite" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>}
              
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the item..." {...field} /></FormControl><FormMessage /></FormItem>
              )}/>

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
              ) : (
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
                Add Item
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
