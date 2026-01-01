'use server';

import { auth } from '@/firebase/admin';
import { db as adminDb } from '@/firebase/admin';

export async function deleteUserAction(uid: string): Promise<{ success: boolean, error?: string }> {
  try {
    // Check if the user is an admin before proceeding (important for security)
    // This is a placeholder for actual admin verification logic
    
    // Delete from Firebase Authentication
    await auth.deleteUser(uid);
    
    // Delete from Firestore
    const userDocRef = adminDb.collection('users').doc(uid);
    await userDocRef.delete();

    // Optionally: Delete sub-collections like 'notifications', etc.
    // This would require a recursive delete function. For now, we'll delete the main doc.
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete user:", error);
    return { success: false, error: error.message || 'An unknown error occurred.' };
  }
}
