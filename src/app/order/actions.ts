
'use server';

import { z } from 'zod';
import { siteConfig } from '@/lib/constants';

const orderFormSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  email: z.string().email(),
  weddingDate: z.date(),
  selectedService: z.string().min(1),
  message: z.string().max(500).optional(),
});

export async function submitOrder(data: z.infer<typeof orderFormSchema>) {
  const validation = orderFormSchema.safeParse(data);

  if (!validation.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  // Here you would typically save the order to a database (e.g., Firebase Firestore)
  console.log('New Order Received:', validation.data);

  // You could also trigger a WhatsApp message or email notification here.
  // For example, generating a WhatsApp link:
  const serviceName = validation.data.selectedService;
  const message = `New Order from ${validation.data.fullName}!\n\nService: ${serviceName}\nPhone: ${validation.data.phone}\nWedding Date: ${validation.data.weddingDate.toLocaleDateString()}\n\nMessage: ${validation.data.message || 'None'}`;
  const whatsappUrl = `https://wa.me/${siteConfig.phone}?text=${encodeURIComponent(message)}`;
  console.log('Admin WhatsApp URL:', whatsappUrl);


  // Simulate a successful submission
  return { success: true, message: 'Order submitted successfully!' };
}
