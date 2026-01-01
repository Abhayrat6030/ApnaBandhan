
import admin from 'firebase-admin';

// This function ensures we only initialize the app once.
const initializeAdminApp = () => {
  // Temporary debugging log as requested by the user.
  console.log("ADMIN ENV CHECK:", {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    hasKey: !!process.env.FIREBASE_PRIVATE_KEY,
  });

  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Construct the service account object from individual environment variables.
  // This approach is more reliable in various deployment environments.
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // The private key must be parsed to handle escaped newlines.
    privateKey: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined,
  };

  // Validate that all necessary parts of the service account are present.
  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      const missingVars = [
          !serviceAccount.projectId && 'FIREBASE_PROJECT_ID',
          !serviceAccount.clientEmail && 'FIREBASE_CLIENT_EMAIL',
          !serviceAccount.privateKey && 'FIREBASE_PRIVATE_KEY'
      ].filter(Boolean).join(', ');
      
      // This error indicates a server configuration problem.
      throw new Error(`The following Firebase Admin environment variables are missing: ${missingVars}. Please ensure they are set for your deployment environment.`);
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.message);
    // Re-throw a clearer error to make it clear that initialization failed.
    throw new Error('Could not initialize Firebase Admin SDK. Check your Firebase environment variables and their format.');
  }
};

// Initialize the app and export the initialized services.
const adminApp = initializeAdminApp();
const db = admin.firestore(adminApp);
const auth = admin.auth(adminApp);

export { db, auth };
export default adminApp;
