
import admin from 'firebase-admin';

/**
 * Initializes the Firebase Admin SDK if not already initialized.
 * This function is designed to be safely called multiple times (idempotent).
 * It uses environment variables for credentials, making it suitable for deployment environments like Netlify.
 */
export const initializeAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Replace escaped newlines from environment variables
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // During the build process on Netlify, these variables might not be available.
  // We only want to throw an error if we are in a runtime environment where they are expected.
  if (!projectId || !clientEmail || !privateKey) {
    // If the function is called in an environment where these are expected (e.g., an API route at runtime),
    // and they are missing, it's a critical error.
    // However, during build time, we can skip initialization.
    if (process.env.NODE_ENV === 'production' && process.env.NETLIFY) {
        console.warn("Firebase Admin environment variables are not available during build. Skipping initialization.");
        return null;
    }
    // For local dev or other runtime environments, we throw.
    throw new Error('Missing Firebase Admin environment variables: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId: projectId,
    });
  } catch (error: any) {
    if (error.code === 'app/duplicate-app') {
      return admin.app();
    }
    console.error('Firebase admin initialization error:', error);
    throw new Error('Firebase admin initialization failed: ' + error.message);
  }
};
