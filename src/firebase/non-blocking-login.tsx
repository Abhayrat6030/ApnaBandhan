
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { signUpUser } from '@/app/actions/auth';


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
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (referralCode) {
      formData.append('referralCode', referralCode);
    }
    const result = await signUpUser(null, formData);

    if (!result.success) {
      throw new Error(result.message);
    }

    // After successful sign-up via server action, sign in the user on the client
    await signInWithEmailAndPassword(auth, email, password);

    return result;
}
