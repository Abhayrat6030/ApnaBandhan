import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK only once
if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set or empty.');
    }
    
    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.message);
    if (e.message.includes('JSON')) {
        console.error('This might be due to an improperly formatted FIREBASE_SERVICE_ACCOUNT_KEY environment variable.');
    }
  }
}

export default admin;
