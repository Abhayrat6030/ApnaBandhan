'use client';

import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Loader2, Tag, X, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect, useMemo } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, increment } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUser, errorEmitter, useFirestore } from '@/firebase';
import { FirestorePermissionError } from '@/firebase/errors';
import type { Coupon, Service, Package } from '@/lib/types';
import { Separator } from '@/components/ui/separator';


const orderFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  weddingDate: z.date({ required_error: 'Wedding date is required.' }),
  selectedService: z.string().optional(),
  customRequirement: z.string().optional(),
  message: z.string().max(500, { message: 'Message must be less than 500 characters.' }).optional(),
}).refine(data => !!data.selectedService || !!data.customRequirement, {
  message: 'Please either select a service or describe your requirement.',
  path: ['selectedService'], // Show error under the select field
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface ServiceListItem {
  id: string;
  name: string;
  price: number;
}


export default function OrderFormComponent() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { user } = useUser();
  const db = useFirestore();
  
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCouponLoading, setIsCouponLoading] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [serviceList, setServiceList] = useState<ServiceListItem[]>([]);
  const [isServiceListLoading, setIsServiceListLoading] = useState(true);

  useEffect(() => {
    async function fetchServiceList() {
        if (!db) return;
        setIsServiceListLoading(true);
        try {
            const servicesSnapshot = await getDocs(collection(db, 'services'));
            const packagesSnapshot = await getDocs(collection(db, 'comboPackages'));
            
            const services = servicesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Service));
            const packages = packagesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Package));

             const allItems: ServiceListItem[] = [
                ...services.map(s => ({ id: s.id, name: s.name, price: s.price })),
                ...packages.map(p => {
                    const priceString = p.price;
                    const priceNumber = typeof priceString === 'string' 
                        ? parseFloat(priceString.replace(/[^0-9.]/g, '')) 
                        : 0;
                    return { id: p.id, name: p.name, price: isNaN(priceNumber) ? 0 : priceNumber };
                })
            ];
            
            const uniqueItems = Array.from(new Map(allItems.map(item => [item.id, item])).values());
            setServiceList(uniqueItems);
        } catch (error) {
            console.error("Failed to fetch service list:", error);
            toast({ title: 'Error', description: 'Could not load services.', variant: 'destructive' });
        } finally {
            setIsServiceListLoading(false);
        }
    }
    fetchServiceList();
  }, [db, toast]);


  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      selectedService: serviceId || '',
      customRequirement: '',
      message: '',
    },
  });

  const selectedServiceId = form.watch('selectedService');
  
  const servicePrice = useMemo(() => {
    if (!selectedServiceId) return 0;
    const service = serviceList.find(s => s.id === selectedServiceId);
    return service?.price || 0;
  }, [selectedServiceId, serviceList]);

  const finalPrice = useMemo(() => {
    return Math.max(0, servicePrice - discount);
  }, [servicePrice, discount]);

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.displayName || '',
        email: user.email || '',
        selectedService: serviceId || '',
        phone: user.phoneNumber || '',
        message: '',
      });
    }
  }, [user, form, serviceId]);
  
  useEffect(() => {
      if (serviceId && serviceList.length > 0) {
        form.setValue('selectedService', serviceId);
      }
  }, [serviceId, serviceList, form]);

  useEffect(() => {
      if (appliedCoupon) {
          calculateDiscount(appliedCoupon, servicePrice);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicePrice, appliedCoupon]);

  const calculateDiscount = (coupon: Coupon, price: number) => {
    let calculatedDiscount = 0;
    if (coupon.discountType === 'percentage') {
        calculatedDiscount = (price * coupon.discountValue) / 100;
    } else { // fixed
        calculatedDiscount = coupon.discountValue;
    }
    setDiscount(calculatedDiscount);
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim() || !db) return;
    setIsCouponLoading(true);

    try {
        const couponsRef = collection(db, 'coupons');
        const q = query(couponsRef, where('code', '==', couponInput.trim().toUpperCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            toast({ title: 'Invalid Coupon', description: 'This coupon code does not exist.', variant: 'destructive' });
            setIsCouponLoading(false);
            return;
        }

        const couponDoc = querySnapshot.docs[0];
        const couponData = { id: couponDoc.id, ...couponDoc.data() } as Coupon;
        
        const isExpired = new Date(couponData.expiryDate) < new Date();
        const isMaxedOut = couponData.maxUses != null && couponData.currentUses >= couponData.maxUses;

        if (!couponData.isActive || isExpired || isMaxedOut) {
             toast({ title: 'Invalid Coupon', description: 'This coupon is inactive, expired, or has reached its usage limit.', variant: 'destructive' });
             setIsCouponLoading(false);
             return;
        }

        setAppliedCoupon(couponData);
        calculateDiscount(couponData, servicePrice);
        toast({ title: 'Coupon Applied!', description: `You've received a discount.` });

    } catch (error) {
        toast({ title: 'Error', description: 'Could not apply coupon. Please try again.', variant: 'destructive' });
    }

    setIsCouponLoading(false);
  }
  
  const removeCoupon = () => {
      setAppliedCoupon(null);
      setCouponInput('');
      setDiscount(0);
      toast({ title: 'Coupon Removed' });
  }


  async function onSubmit(data: OrderFormValues) {
    setIsSubmitting(true);

    if (!user || !db) {
        toast({
            title: "Authentication Error",
            description: "You must be logged in to place an order.",
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }

    const newOrder = {
        userId: user.uid,
        fullName: data.fullName,
        phoneNumber: data.phone,
        email: data.email,
        weddingDate: data.weddingDate.toISOString().split('T')[0],
        selectedServiceId: data.selectedService || `Custom: ${data.customRequirement}`,
        messageNotes: data.message || '',
        orderDate: new Date().toISOString(),
        status: 'Pending' as const,
        paymentStatus: 'Pending' as const,
        couponCode: appliedCoupon?.code || '',
        discountAmount: discount,
        totalPrice: finalPrice,
    };

    try {
      const ordersCollection = collection(db, 'orders');
      await addDoc(ordersCollection, newOrder);

      if (appliedCoupon) {
          const couponRef = doc(db, 'coupons', appliedCoupon.id);
          await updateDoc(couponRef, {
              currentUses: increment(1)
          });
      }

      toast({
          title: "Order Submitted Successfully!",
          description: "We have received your details and will contact you shortly.",
      });
      form.reset();
      setIsSubmitted(true);
    } catch (error) {
      console.error("Order submission error:", error);
      const contextualError = new FirestorePermissionError({
        path: 'orders',
        operation: 'create',
        requestResourceData: newOrder
      });
      errorEmitter.emit('permission-error', contextualError);
      toast({
          title: "Submission Failed",
          description: "Something went wrong. Please check permissions and try again.",
          variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 flex justify-center">
            <Card className="w-full max-w-2xl text-center">
                <CardHeader>
                    <CardTitle className="font-bold text-3xl">Thank You!</CardTitle>
                    <CardDescription>Your order has been placed successfully.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">Our team will review your details and get in touch with you via WhatsApp or phone within 24 hours to proceed.</p>
                    <Button asChild variant="secondary">
                        <a href="/">Back to Home</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-bold text-3xl">Book Your Service</CardTitle>
          <CardDescription>Fill out the form below to place your order. We'll get back to you shortly!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Rohan Sharma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (with country code)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. +91 9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. rohan.sharma@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                
              <FormField
                  control={form.control}
                  name="weddingDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Wedding Date</FormLabel>
                       <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date()
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="selectedService"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select a Service</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger disabled={isServiceListLoading}>
                            <SelectValue placeholder={isServiceListLoading ? "Loading..." : "Select a service or package"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {serviceList.map(service => (
                            <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="relative flex items-center justify-center text-center">
                    <Separator className="w-full" />
                    <span className="absolute bg-card px-2 text-sm text-muted-foreground">OR</span>
                </div>
                
                <FormField
                  control={form.control}
                  name="customRequirement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Or describe your requirement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'I need a 2-minute engagement party invitation video with a modern theme.'"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Message / Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any other details? (e.g., specific song, color preference)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Coupon Code</FormLabel>
                {appliedCoupon ? (
                     <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-700">{appliedCoupon.code}</span>
                        <p className="text-sm text-green-600 flex-1">Coupon applied!</p>
                        <Button type="button" variant="ghost" size="icon" onClick={removeCoupon} className="h-6 w-6">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 mt-2">
                        <Input 
                          placeholder="Enter coupon code" 
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          className="max-w-xs"
                          disabled={!selectedServiceId}
                        />
                        <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={isCouponLoading || !couponInput.trim() || !selectedServiceId}>
                            {isCouponLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Apply
                        </Button>
                    </div>
                )}
              </div>

               <Card className="bg-muted/50">
                  <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-lg">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₹{servicePrice.toLocaleString('en-IN')}</span>
                      </div>
                      {discount > 0 && (
                          <div className="flex justify-between text-green-600">
                              <span>Discount ({appliedCoupon?.code})</span>
                              <span>- ₹{discount.toLocaleString('en-IN')}</span>
                          </div>
                      )}
                      <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                          <span>Total</span>
                          <span>₹{finalPrice.toLocaleString('en-IN')}</span>
                      </div>
                  </CardContent>
              </Card>

              <Button type="submit" disabled={isSubmitting || !user || !db} className="w-full" size="lg">
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : 'Place Order'}
              </Button>
               {!(user && !user.isAnonymous) && <p className="text-center text-sm text-muted-foreground">Please log in to place an order.</p>}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
