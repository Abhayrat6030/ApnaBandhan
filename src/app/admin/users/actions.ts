'use server';

import admin from 'firebase-admin';
import { initializeAdminApp } from '@/firebase/admin';

// Ensure the admin app is initialized before using its services
initializeAdminApp();

export async function deleteUserAction(uid: string): Promise<{ success: boolean, error?: string }> {
  try {
    const auth = admin.auth();
    const db = admin.firestore();

    // Firebase Authentication से उपयोगकर्ता हटाएं
    await auth.deleteUser(uid);
    
    // Firestore से उपयोगकर्ता दस्तावेज़ हटाएं
    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.delete();

    // वैकल्पिक: आप यहां 'notifications' जैसी उप-संग्रहों को हटाने के लिए एक रिकर्सिव डिलीट फ़ंक्शन भी जोड़ सकते हैं।
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
