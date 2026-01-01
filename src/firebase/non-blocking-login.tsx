'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
}

/** Initiate email/password sign-up (non-blocking). */
export async function initiateEmailSignUp(
    authInstance: Auth, 
    email: string, 
    password: string, 
    displayName: string,
) {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        
        const userProfile = {
            uid: userCredential.user.uid,
            displayName: displayName,
            email: email,
            createdAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, userProfile);
    }
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
