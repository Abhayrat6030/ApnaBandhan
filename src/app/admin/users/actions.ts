'use server';

import { config } from 'dotenv';
config();

import admin from 'firebase-admin';

// Helper function to initialize the admin app safely
const initializeAdminApp = () => {
    if (admin.apps.length > 0) {
        return;
    }

    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    const missingVars = [
        !serviceAccount.projectId && 'FIREBASE_PROJECT_ID',
        !serviceAccount.clientEmail && 'FIREBASE_CLIENT_EMAIL',
        !serviceAccount.privateKey && 'FIREBASE_PRIVATE_KEY',
    ].filter(Boolean).join(', ');

    if (missingVars) {
        throw new Error(`Firebase admin initialization failed: Missing environment variables: ${missingVars}`);
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
    } catch (error: any) {
        if (!/already exists/u.test(error.message)) {
            console.error('Firebase admin initialization error', error);
            throw new Error('Firebase admin initialization failed: ' + error.message);
        }
    }
};


export async function deleteUserAction(uid: string): Promise<{ success: boolean, error?: string }> {
  // Ensure the admin app is initialized before using its services
  initializeAdminApp();
  
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
