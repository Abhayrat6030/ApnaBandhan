
'use server';

import admin from 'firebase-admin';

// Helper function to initialize the admin app safely, ensuring env vars are read
const initializeAdminApp = () => {
    // This function will now be called within the action, where process.env is available.
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
        // This error will now correctly report which variables are missing.
        throw new Error(`Firebase admin initialization failed: Missing environment variables: ${missingVars}`);
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        });
    } catch (error: any) {
        // Catch cases where the app might already be initialized in a concurrent request.
        if (!/already exists/u.test(error.message)) {
            console.error('Firebase admin initialization error', error);
            throw new Error('Firebase admin initialization failed: ' + error.message);
        }
    }
};


export async function deleteUserAction(uid: string): Promise<{ success: boolean, error?: string }> {
  // Initialize the admin app right before using its services.
  initializeAdminApp();
  
  try {
    const auth = admin.auth();
    const db = admin.firestore();

    // Delete user from Firebase Authentication
    await auth.deleteUser(uid);
    
    // Delete user document from Firestore
    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.delete();

    // Optional: You could also add a recursive delete function here for sub-collections like 'notifications'.
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
