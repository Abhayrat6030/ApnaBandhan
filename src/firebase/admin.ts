
import admin from 'firebase-admin';
import 'dotenv/config';

/**
 * Initializes the Firebase Admin SDK if not already initialized.
 * This function is designed to be safely called multiple times (idempotent).
 */
export const initializeAdminApp = () => {
  // Check if the default app is already initialized to avoid re-initialization errors.
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Retrieve service account credentials from environment variables.
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // The private key might have newline characters that need to be parsed correctly.
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  // Validate that all necessary environment variables are present.
  const missingVars = [
    !serviceAccount.projectId && 'FIREBASE_PROJECT_ID',
    !serviceAccount.clientEmail && 'FIREBASE_CLIENT_EMAIL',
    !serviceAccount.privateKey && 'FIREBASE_PRIVATE_KEY',
  ].filter(Boolean).join(', ');

  if (missingVars) {
    console.error(`Firebase admin initialization failed: Missing environment variables: ${missingVars}`);
    throw new Error(`Firebase admin initialization failed: Missing environment variables: ${missingVars}`);
  }

  // Initialize the app with the credentials.
  try {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (error: any) {
    // Catch and log any other initialization errors.
    console.error('Firebase admin initialization error:', error);
    throw new Error('Firebase admin initialization failed: ' + error.message);
  }
};
