
import admin from 'firebase-admin';

/**
 * Initializes the Firebase Admin SDK if not already initialized.
 * This function is designed to be safely called multiple times (idempotent).
 * It uses Application Default Credentials, which are automatically available in
 * many Google Cloud environments.
 */
export const initializeAdminApp = () => {
  // Check if the default app is already initialized to avoid re-initialization errors.
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // Initialize the app without explicit credentials.
  // The SDK will automatically look for Application Default Credentials.
  try {
    return admin.initializeApp();
  } catch (error: any) {
    // Catch and log any other initialization errors.
    console.error('Firebase admin initialization error:', error);
    throw new Error('Firebase admin initialization failed: ' + error.message);
  }
};
