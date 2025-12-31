
'use server';

import { z } from 'zod';
import { siteConfig } from '@/lib/constants';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const orderFormSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  email: z.string().email(),
  weddingDate: z.date(),
  selectedService: z.string().min(1),
  message: z.string().max(500).optional(),
  userId: z.string().optional(),
});

export async function submitOrder(data: z.infer<typeof orderFormSchema>) {
  const validation = orderFormSchema.safeParse(data);

  if (!validation.success) {
    console.error('Order validation failed:', validation.error.flatten());
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const { firestore } = initializeFirebase();
    const ordersCollection = collection(firestore, 'orders');

    const serviceName = validation.data.selectedService; // Assuming service ID is passed
    
    const newOrder = {
        fullName: validation.data.fullName,
        phoneNumber: validation.data.phone,
        email: validation.data.email,
        weddingDate: validation.data.weddingDate.toISOString().split('T')[0],
        selectedServiceId: serviceName,
        messageNotes: validation.data.message || '',
        orderDate: new Date().toISOString(),
        status: 'Pending',
        paymentStatus: 'Pending',
        userId: validation.data.userId || null,
    };

    await addDoc(ordersCollection, newOrder);

    console.log('New Order successfully saved to Firestore:', newOrder);

    const whatsappMessage = `New Order from ${validation.data.fullName}!\n\nService ID: ${serviceName}\nPhone: ${validation.data.phone}\nWedding Date: ${validation.data.weddingDate.toLocaleDateString()}\n\nMessage: ${validation.data.message || 'None'}`;
    const whatsappUrl = `https://wa.me/${siteConfig.phone}?text=${encodeURIComponent(whatsappMessage)}`;
    console.log('Admin WhatsApp URL:', whatsappUrl);

    return { success: true, message: 'Order submitted successfully!' };

  } catch (error) {
    console.error('Error submitting order to Firestore:', error);
    return { success: false, message: 'Failed to submit order. Please try again later.' };
  }
}
