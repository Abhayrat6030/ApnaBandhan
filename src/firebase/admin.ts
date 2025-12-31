
import * as admin from 'firebase-admin';

let adminApp: admin.app.App;

// Check if the service account key is available
if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

    // Initialize the app if it's not already initialized
    if (!admin.apps.length) {
      try {
        adminApp = admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
      } catch (e) {
        console.error('Firebase admin initialization error', e);
      }
    } else {
        adminApp = admin.app();
    }
} else {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Firebase Admin SDK not initialized. Server-side admin actions will be disabled.');
}


// Export the initialized app, which may be undefined if the key is not set
export { adminApp };
