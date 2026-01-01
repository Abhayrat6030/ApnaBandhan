'use server';

import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    // Check if all required environment variables are present
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        throw new Error('Firebase Admin SDK service account credentials are not set in environment variables.');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
    });
  } catch (error: any) {
    if (!/already exists/u.test(error.message)) {
      console.error('Firebase admin initialization error', error.stack);
    }
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
