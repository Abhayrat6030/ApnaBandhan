
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where, writeBatch, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';


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
