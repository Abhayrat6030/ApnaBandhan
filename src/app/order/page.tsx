'use client';

import { useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { services, packages } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { submitOrder } from './actions';

const allServicesAndPackages = [...services, ...packages].map(s => ({ id: s.id, name: s.name }));
const uniqueServices = Array.from(new Map(allServicesAndPackages.map(item => [item.id, item])).values());


const orderFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  weddingDate: z.date({ required_error: 'Wedding date is required.' }),
  selectedService: z.string().min(1, { message: 'Please select a service.' }),
  message: z.string().max(500, { message: 'Message must be less than 500 characters.' }).optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

export default function OrderPage() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      selectedService: serviceId || '',
      message: '',
    },
  });

  async function onSubmit(data: OrderFormValues) {
    setIsSubmitting(true);
    const result = await submitOrder(data);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Order Submitted Successfully!",
        description: "We have received your details and will contact you shortly.",
        variant: "default"
      });
      form.reset();
      setIsSubmitted(true);
    } else {
      toast({
        title: "Submission Failed",
        description: result.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (isSubmitted) {
    return (
        <div className="container mx-auto px-4 py-16 md:py-24 flex justify-center">
            <Card className="w-full max-w-2xl text-center">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Thank You!</CardTitle>
                    <CardDescription>Your order has been placed successfully.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">Our team will review your details and get in touch with you via WhatsApp or phone within 24 hours to proceed.</p>
                    <Button asChild>
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
          <CardTitle className="font-headline text-3xl">Book Your Service</CardTitle>
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
                        <Input placeholder="e.g. +919876543210" {...field} />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="selectedService"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selected Service</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service or package" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {uniqueServices.map(service => (
                            <SelectItem key={service.id} value={service.id}>{service.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message / Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special requests or details? (e.g., theme, color preference)"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : 'Place Order'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
