'use server';

import * as admin from 'firebase-admin';

const initializeAdminApp = (): admin.app.App => {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  try {
    const adminApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://studio-5455681471-6a9b7-default-rtdb.firebaseio.com`,
    });
    return adminApp;
  } catch (error: any) {
    console.error('Firebase admin initialization error', error);
    throw new Error('Firebase admin initialization failed: ' + error.message);
  }
};

function getAdminAuth(): admin.auth.Auth {
    initializeAdminApp();
    return admin.auth();
}

function getAdminDb(): admin.firestore.Firestore {
    initializeAdminApp();
    return admin.firestore();
}

export const auth = getAdminAuth();
export const db = getAdminDb();
