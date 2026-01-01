
import admin from 'firebase-admin';

// This function ensures we only initialize the app once.
const initializeAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // The private key from environment variables needs to have its newlines escaped.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // Check for necessary environment variables.
  const missingVars = [
    !process.env.FIREBASE_PROJECT_ID && 'FIREBASE_PROJECT_ID',
    !process.env.FIREBASE_CLIENT_EMAIL && 'FIREBASE_CLIENT_EMAIL',
    !privateKey && 'FIREBASE_PRIVATE_KEY',
  ].filter(Boolean).join(', ');

  if (missingVars) {
      // This error indicates a server configuration problem.
      throw new Error(`The following Firebase Admin environment variables are missing: ${missingVars}. Please ensure they are set for your deployment environment.`);
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.message);
    // This error will now only happen if the credentials themselves are malformed.
    throw new Error('Could not initialize Firebase Admin SDK. The credentials may be malformed or missing.');
  }
};

// Initialize the app and export the initialized services.
const adminApp = initializeAdminApp();
const db = admin.firestore(adminApp);
const auth = admin.auth(adminApp);

export { db, auth };
export default adminApp;
