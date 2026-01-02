
import admin from 'firebase-admin';

/**
 * Initializes the Firebase Admin SDK if not already initialized.
 * This function is designed to be safely called multiple times (idempotent).
 * It uses environment variables for credentials, making it suitable for deployment environments like Netlify.
 * 
 * This new "lazy" pattern prevents initialization during the build process if env vars are missing.
 */
export const initializeAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Replace escaped newlines from environment variables
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // If environment variables are not available (e.g., during build time), do not throw an error.
  // Instead, return null. The calling function will be responsible for handling this case.
  if (!projectId || !clientEmail || !privateKey) {
    console.warn("Firebase Admin environment variables are not available. Skipping initialization. This is normal during build.");
    return null;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      projectId: projectId,
    });
    return admin;
  } catch (error: any) {
    if (error.code === 'app/duplicate-app') {
      return admin; // Return the already initialized app
    }
    console.error('Firebase admin initialization error:', error);
    // In case of other initialization errors, we also return null.
    return null;
  }
};
