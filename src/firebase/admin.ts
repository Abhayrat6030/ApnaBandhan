
import admin from 'firebase-admin';

/**
 * Initializes the Firebase Admin SDK if not already initialized.
 * This function is designed to be safely called multiple times.
 */
export const initializeAdminApp = () => {
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
