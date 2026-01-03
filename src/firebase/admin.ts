
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

  // If environment variables are not available, throw a specific, descriptive error.
  if (!projectId || !clientEmail || !privateKey) {
    const errorMessage = "Firebase Admin environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are not set. Admin SDK cannot be initialized.";
    console.error(errorMessage);
    // Throwing an error is better than returning null, as it provides a clear failure reason.
    throw new Error(errorMessage);
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
    // Re-throw the error to ensure the calling function knows initialization failed.
    throw error;
  }
};
