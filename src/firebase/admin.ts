
import * as admin from 'firebase-admin';

// This guard prevents re-initialization in hot-reload scenarios.
if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set.');
    }
    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
     console.log("Firebase Admin SDK initialized successfully.");
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.message);
  }
}

// We export the admin namespace directly.
// The functions that need it (like getAuth()) can call admin.auth()
// This ensures they use the initialized app instance.
export default admin;
