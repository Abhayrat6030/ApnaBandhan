import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set or empty.');
    }
    
    // The environment variable is a string, so it needs to be parsed into an object.
    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (e: any) {
    // Log a more descriptive error.
    console.error('Firebase Admin SDK initialization error:', e.message);
    if (e.message.includes('JSON')) {
        console.error('This might be due to an improperly formatted FIREBASE_SERVICE_ACCOUNT_KEY environment variable.');
    }
  }
}

export default admin;
