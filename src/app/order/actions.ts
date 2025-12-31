
'use server';

import { z } from 'zod';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { auth as adminAuth } from 'firebase-admin';
import { initializeFirebase } from '@/firebase';
import { getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

// This is the schema for the data coming directly from the form
const orderFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Please enter a valid phone number.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  weddingDate: z.date({ required_error: 'Wedding date is required.' }),
  selectedService: z.string().min(1, { message: 'Please select a service.' }),
  message: z.string().max(500, { message: 'Message must be less than 500 characters.' }).optional(),
});


// Helper function to initialize Firebase Admin SDK idempotently
function initializeAdminApp(): App {
    if (getApps().length > 0) {
        return getApp();
    }
    // In a deployed environment (like Firebase App Hosting), credentials are automatically discovered.
    // For local development, you'd need to set up a service account.
    return initializeApp();
}

export async function submitOrder(data: unknown, idToken: string) {
  const validation = orderFormSchema.safeParse(data);

  if (!validation.success) {
    console.error('Order validation failed:', validation.error.flatten());
    return { success: false, message: 'Invalid data provided. Please check the form and try again.' };
  }
  
  if (!idToken) {
    return { success: false, message: 'Authentication error. You must be logged in to place an order.' };
  }

  try {
    const adminApp = initializeAdminApp();
    const adminAuth = getAdminAuth(adminApp);
    
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (!userId) {
        return { success: false, message: 'Could not verify user. Please log in again.' };
    }

    // Use client SDK for writing data as the user
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

    return { success: true, message: 'Order submitted successfully!' };

  } catch (error: any) {
    console.error('Error submitting order:', error);
     if (error.code === 'auth/id-token-expired') {
        return { success: false, message: 'Your session has expired. Please log in again.' };
    }
     if (error.code === 'auth/argument-error' || error.codePrefix === 'auth') {
        return { success: false, message: 'Authentication failed. Please log in and try again.' };
     }
    return { success: false, message: 'An internal server error occurred. Please try again later.' };
  }
}
