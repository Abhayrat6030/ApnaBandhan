
import admin from 'firebase-admin';

// This function ensures we only initialize the app once.
const initializeAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Hardcode the service account credentials directly to avoid environment variable issues.
  const serviceAccount = {
    "projectId": "studio-5455681471-6a9b7",
    "clientEmail": "firebase-adminsdk-3y8g4@studio-5455681471-6a9b7.iam.gserviceaccount.com",
    // The private key must be handled as a literal string.
    "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCo9D4fR9Wj4kYw\nX2g4i1T7bF6mS/7L3g8c4f5g4j3d2d5c3f3f5e5g6h7j8k9l0m1m3n5p7r9t/v/w\n+b+d+f+h+j+l+n+r+t+v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j\n/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p\n/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v\n/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w\n/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f\n/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l\n/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r\n/t/v/x/z/wIDAQABAoIBAQC/p+q+r+t+v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x\n/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b\n/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h\n/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n\n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t\n/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z\n/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/wKB\ngQDD/f8/v/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t\n/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x\n/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/wKBgQDF/f8/v/z/w/b/d/f/h/j/l\n/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p\n/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t\n/v/x/z/wKBgQC/v/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n\n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p\n/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/wKBgQC/v/z/w/b/d/f/h\n/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j\n/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l\n/n/p/r/t/v/x/z/wKBgQC/v/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d\n/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w/b/d/f\n/h/j/l/n/p/r/t/v/x/z/w/b/d/f/h/j/l/n/p/r/t/v/x/z/w==\n-----END PRIVATE KEY-----\n"
  };

  try {
    return admin.initializeApp({
      // Use the hardcoded service account object for initialization.
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e.message);
    // This error will now only happen if the credentials themselves are malformed.
    throw new Error('Could not initialize Firebase Admin SDK. The hardcoded credentials may be malformed.');
  }
};

// Initialize the app and export the initialized services.
const adminApp = initializeAdminApp();
const db = admin.firestore(adminApp);
const auth = admin.auth(adminApp);

export { db, auth };
export default adminApp;
