
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(
    authInstance: Auth, 
    email: string, 
    password: string,
    onError: (error: any) => void
) {
  signInWithEmailAndPassword(authInstance, email, password)
     .catch(error => {
        onError(error);
     });
}

/** Initiate password reset email (non-blocking). */
export function initiatePasswordReset(authInstance: Auth, email: string) {
    sendPasswordResetEmail(authInstance, email)
        .catch(error => {
            console.error("Password reset error:", error);
        });
}

/** Initiate email/password sign-up (non-blocking). */
export async function initiateEmailSignUp(auth: Auth, email: string, password: string, name: string, referralCode?: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        // The logic to create the user profile in Firestore is now handled
        // in the /profile page component for robustness.
    }
    return userCredential;
}
