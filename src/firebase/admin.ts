import 'dotenv/config';
import admin from 'firebase-admin';

// This function ensures we only initialize the app once.
const initializeAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }
    
    const serviceAccount = JSON.parse(serviceAccountString);

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.message);
    if (e instanceof SyntaxError) {
      console.error('The FIREBASE_SERVICE_ACCOUNT_KEY might be improperly formatted. Ensure it is a valid JSON string.');
    }
    // Re-throw the error to make it clear that initialization failed.
    throw new Error('Could not initialize Firebase Admin SDK.');
  }
};

// Initialize the app and export the initialized services.
// This pattern ensures that initialization happens only once.
const adminApp = initializeAdminApp();
const db = admin.firestore(adminApp);
const auth = admin.auth(adminApp);

export { db, auth };
export default adminApp;
