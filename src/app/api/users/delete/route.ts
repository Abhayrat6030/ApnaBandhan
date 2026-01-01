'use server';

import { NextRequest, NextResponse } from 'next/server';
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

export async function DELETE(req: NextRequest) {
  try {
    const { uid } = await req.json();

    if (!uid) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    initializeAdminApp();
    const auth = admin.auth();
    const db = admin.firestore();

    // Delete user from Firebase Authentication
    await auth.deleteUser(uid);
    
    // Delete user document from Firestore
    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ success: false, error: error.message || 'An unknown error occurred.' }, { status: 500 });
  }
}
