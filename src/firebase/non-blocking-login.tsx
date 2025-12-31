'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(
    authInstance: Auth, 
    email: string, 
    password: string, 
    displayName: string,
    onSuccess: () => void,
    onError: (error: any) => void
) {
  // CRITICAL: Call createUserWithEmailAndPassword directly.
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => {
        if (userCredential.user) {
            // After creating the user, update their profile with the display name
            updateProfile(userCredential.user, { displayName }).then(() => {
                onSuccess();
            }).catch(error => {
                onError(error);
            });
        }
    })
    .catch(error => {
        onError(error);
    });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string) {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password)
     .catch(error => {
        console.error("Sign in error:", error);
     });
}

/** Initiate password reset email (non-blocking). */
export function initiatePasswordReset(authInstance: Auth, email: string) {
    sendPasswordResetEmail(authInstance, email)
        .catch(error => {
            console.error("Password reset error:", error);
        });
}
