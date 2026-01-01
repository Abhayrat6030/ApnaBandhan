import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://studio-5455681471-6a9b7-default-rtdb.firebaseio.com`,
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.stack);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
