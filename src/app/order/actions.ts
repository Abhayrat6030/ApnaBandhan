
'use server';

import { z } from 'zod';
import { siteConfig } from '@/lib/constants';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { auth as adminAuth } from 'firebase-admin';
import { initializeFirebase } from '@/firebase';
import { headers } from 'next/headers';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';

// This is the schema for the data coming directly from the form
const orderFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  weddingDate: z.date({ required_error: 'Wedding date is required.' }),
  selectedService: z.string().min(1, { message: 'Please select a service.' }),
  message: z.string().max(500, { message: 'Message must be less than 500 characters.' }).optional(),
});


// Helper function to initialize Firebase Admin SDK
function initializeAdminApp() {
    if (getApps().length > 0) {
        return getApp();
    }
    return initializeApp();
}

export async function submitOrder(data: unknown) {
  const validation = orderFormSchema.safeParse(data);

  if (!validation.success) {
    console.error('Order validation failed:', validation.error.flatten());
    return { success: false, message: 'Invalid data provided. Please check the form and try again.' };
  }
  
  const headersList = headers();
  const authorization = headersList.get('Authorization');
  const idToken = authorization?.split('Bearer ')[1] || null;

  if (!idToken) {
    return { success: false, message: 'Authentication error. You must be logged in to place an order.' };
  }

  try {
    initializeAdminApp();
    
    const decodedToken = await adminAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (!userId) {
        return { success: false, message: 'Could not verify user. Please log in again.' };
    }

    const { firestore } = initializeFirebase();
    const ordersCollection = collection(firestore, 'orders');
    
    const newOrder = {
        userId: userId,
        fullName: validation.data.fullName,
        phoneNumber: validation.data.phone,
        email: validation.data.email,
        weddingDate: validation.data.weddingDate.toISOString().split('T')[0], // format to YYYY-MM-DD
        selectedServiceId: validation.data.selectedService,
        messageNotes: validation.data.message || '',
        orderDate: new Date().toISOString(),
        status: 'Pending',
        paymentStatus: 'Pending',
    };

    const docRef = await addDoc(ordersCollection, newOrder);

    console.log('New Order successfully saved to Firestore:', docRef.id);

    // This part can be re-enabled if needed, but is not essential for submission
    // const whatsappMessage = `New Order from ${validation.data.fullName}!\n\nService ID: ${validation.data.selectedService}\nPhone: ${validation.data.phone}\nWedding Date: ${validation.data.weddingDate.toLocaleDateString()}\n\nMessage: ${validation.data.message || 'None'}`;
    // const whatsappUrl = `https://wa.me/${siteConfig.phone}?text=${encodeURIComponent(whatsappMessage)}`;
    // console.log('Admin WhatsApp URL:', whatsappUrl);

    return { success: true, message: 'Order submitted successfully!' };

  } catch (error: any) {
    console.error('Error submitting order:', error);
     if (error.code === 'auth/id-token-expired') {
        return { success: false, message: 'Your session has expired. Please log in again.' };
    }
     if (error.code === 'auth/argument-error') {
        return { success: false, message: 'Authentication failed. Please log in and try again.' };
     }
    return { success: false, message: 'An internal server error occurred. Please try again later.' };
  }
}
