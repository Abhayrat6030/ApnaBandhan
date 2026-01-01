'use server';

import * as admin from 'firebase-admin';
import { config } from 'dotenv';

// Ensure environment variables are loaded
config();

function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    const missingVars = [
        !projectId && "FIREBASE_PROJECT_ID",
        !clientEmail && "FIREBASE_CLIENT_EMAIL",
        !privateKey && "FIREBASE_PRIVATE_KEY"
    ].filter(Boolean).join(', ');

    throw new Error(`Firebase admin initialization failed: Missing environment variables: ${missingVars}`);
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: `https://${projectId}-default-rtdb.firebaseio.com`,
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error);
    // Re-throw a more specific error to aid debugging.
    throw new Error('Firebase admin initialization failed: ' + error.message);
  }
};

// Initialize app once and export services
const adminApp = initializeAdminApp();

export const auth = admin.auth(adminApp);
export const db = admin.firestore(adminApp);
