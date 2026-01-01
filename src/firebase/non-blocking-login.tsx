'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDocs, collection, query, where, writeBatch } from 'firebase/firestore';
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
    referralCodeInput?: string, // The referral code the new user entered
) {
    let referrerId: string | null = null;

    // 1. Validate referral code if provided
    if (referralCodeInput) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("referralCode", "==", referralCodeInput));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            throw new Error("Invalid referral code.");
        } else {
            // It's possible, though unlikely, for multiple users to have the same code if generation isn't atomic.
            // We'll take the first one.
            const referrerDoc = querySnapshot.docs[0];
            referrerId = referrerDoc.id;
        }
    }


    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        
        const newUserDocRef = doc(db, 'users', userCredential.user.uid);
        
        // Generate the new user's own referral code
        const ownReferralCode = `${displayName.replace(/\s+/g, '').substring(0, 4).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;

        const newUserProfile = {
            uid: userCredential.user.uid,
            displayName: displayName,
            email: email,
            createdAt: new Date().toISOString(),
            referralCode: ownReferralCode, // Their own code
            referredBy: referrerId, // The UID of the person who referred them
            status: 'active' as const,
            referredUsers: [] // Array to store UIDs of users they refer
        };

        // If there was a referrer, we need to update both the new user and the referrer's document
        if (referrerId) {
            const batch = writeBatch(db);
            const referrerDocRef = doc(db, 'users', referrerId);

            // Set the new user's document
            batch.set(newUserDocRef, newUserProfile);
            
            // Atomically update the referrer's document to add the new user's UID to their `referredUsers` array
            const referrerDoc = (await getDocs(query(collection(db, 'users'), where("uid", "==", referrerId)))).docs[0];
            const referrerData = referrerDoc.data();
            const referredUsers = referrerData.referredUsers || [];
            
            batch.update(referrerDocRef, {
                referredUsers: [...referredUsers, userCredential.user.uid]
            });

            await batch.commit();

        } else {
            // Otherwise, just create the new user's document
            await setDoc(newUserDocRef, newUserProfile);
        }
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
