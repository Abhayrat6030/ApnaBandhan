
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

/** 
 * Initiates email/password sign-up (non-blocking).
 * This function now ONLY creates the user in Firebase Auth and updates their display name.
 * The user profile document in Firestore is created separately when the user first visits their profile page.
 * This two-step process avoids Firestore permission race conditions during signup.
 */
export async function initiateEmailSignUp(
    authInstance: Auth, 
    email: string, 
    password: string, 
    displayName: string,
    referralCodeInput?: string,
) {
    // Step 1: Validate referral code if provided.
    // We do this *before* creating the user to fail early if the code is invalid.
    if (referralCodeInput) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("referralCode", "==", referralCodeInput));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // Throw an error that the frontend can catch and display to the user.
            throw new Error("Invalid referral code.");
        }
    }
    
    // Step 2: Create the user in Firebase Authentication.
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    const newUser = userCredential.user;

    // Step 3: Update the user's profile in Firebase Authentication (e.g., with displayName).
    await updateProfile(newUser, { displayName });

    // Step 4 (Crucial Change): We DO NOT create the Firestore document here.
    // It will be created on the first visit to the profile page.
    // However, we can temporarily store the referral code info if needed, e.g., in local storage,
    // so the profile page can use it. For simplicity, we will have the profile page logic
    // handle finding the referrer if the `referredBy` field is not set.

    // The user is now created and will be redirected by the frontend.
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
