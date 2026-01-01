import * as admin from 'firebase-admin';

// This ensures we only initialize the app once, preventing errors on hot reloads.
if (!admin.apps.length) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountString) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. This is required for server-side admin operations.');
    }
    
    // The environment variable is a string, so we need to parse it into a JSON object.
    const serviceAccount = JSON.parse(serviceAccountString);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin SDK initialized successfully.");

  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.message);
    // Provide a more helpful error if JSON parsing fails.
    if (e instanceof SyntaxError) {
        console.error('The FIREBASE_SERVICE_ACCOUNT_KEY might be improperly formatted. Ensure it is a valid JSON string.');
    }
  }
}

export default admin;
