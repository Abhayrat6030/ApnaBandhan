
'use server';

import { z } from 'zod';
import { siteConfig } from '@/lib/constants';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { initializeFirebase } from '@/firebase';

const orderFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  weddingDate: z.string().min(1, { message: 'Wedding date is required.' }), // Expect a string
  selectedService: z.string().min(1, { message: 'Please select a service.' }),
  message: z.string().max(500, { message: 'Message must be less than 500 characters.' }).optional(),
});

// Helper function to initialize Firebase Admin SDK
function initializeAdminApp() {
    if (getApps().length > 0) {
        return getApp();
    }
    // This is a simplified initialization for a serverless environment.
    // In a real-world scenario, you would use service account credentials from environment variables.
    return initializeApp();
}


export async function submitOrder(data: any, idToken: string | null) { // Use any to handle incoming JSON
  const validation = orderFormSchema.safeParse({
      ...data,
      // The weddingDate comes in as a string from the fetch body
      weddingDate: data.weddingDate ? new Date(data.weddingDate).toISOString() : undefined,
  });


  if (!validation.success) {
    console.error('Order validation failed:', validation.error.flatten());
    return { success: false, message: 'Invalid data provided.' };
  }
  
  if (!idToken) {
    return { success: false, message: 'Authentication token is missing. Please log in.' };
  }

  try {
    initializeAdminApp();
    
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (!userId) {
        return { success: false, message: 'You must be logged in to place an order.' };
    }

    const { firestore } = initializeFirebase();
    const ordersCollection = collection(firestore, 'orders');

    const serviceName = validation.data.selectedService; // Assuming service ID is passed
    
    const newOrder = {
        fullName: validation.data.fullName,
        phoneNumber: validation.data.phone,
        email: validation.data.email,
        weddingDate: validation.data.weddingDate.split('T')[0],
        selectedServiceId: serviceName,
        messageNotes: validation.data.message || '',
        orderDate: new Date().toISOString(),
        status: 'Pending',
        paymentStatus: 'Pending',
        userId: userId, // CRITICAL FIX: Add the user's ID
    };

    const docRef = await addDoc(ordersCollection, newOrder);

    console.log('New Order successfully saved to Firestore:', docRef.id);

    const whatsappMessage = `New Order from ${validation.data.fullName}!\n\nService ID: ${serviceName}\nPhone: ${validation.data.phone}\nWedding Date: ${new Date(validation.data.weddingDate).toLocaleDateString()}\n\nMessage: ${validation.data.message || 'None'}`;
    const whatsappUrl = `https://wa.me/${siteConfig.phone}?text=${encodeURIComponent(whatsappMessage)}`;
    console.log('Admin WhatsApp URL:', whatsappUrl);

    return { success: true, message: 'Order submitted successfully!' };

  } catch (error: any) {
    console.error('Error submitting order to Firestore:', error);
     if (error.code === 'auth/id-token-expired') {
        return { success: false, message: 'Your session has expired. Please log in again.' };
    }
    return { success: false, message: 'Failed to submit order. Please try again later.' };
  }
}
