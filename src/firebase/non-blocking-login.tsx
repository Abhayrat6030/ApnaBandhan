
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

/** Initiate email/password sign-up (non-blocking). */
export async function initiateEmailSignUp(
    authInstance: Auth, 
    email: string, 
    password: string, 
    displayName: string,
    referralCodeInput?: string, // The referral code the new user entered
) {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    const newUser = userCredential.user;

    let referrerId: string | null = null;
    let referrerDocRef: any = null;

    // 1. Validate referral code if provided
    if (referralCodeInput) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where("referralCode", "==", referralCodeInput));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            await newUser.delete(); // Clean up the created user
            throw new Error("Invalid referral code.");
        } else {
            const referrerDoc = querySnapshot.docs[0];
            // This check is flawed because newUser.uid is not yet in the 'users' collection.
            // A user can't refer themselves anyway since they don't have an account yet.
            // This logic is for preventing using one's own code, which is impossible at signup.
            // The check `referrerDoc.id === newUser.uid` will always be false.
            
            referrerId = referrerDoc.id;
            referrerDocRef = referrerDoc.ref;
        }
    }
    
    // 2. Create the new user's profile
    await updateProfile(newUser, { displayName });
    
    const newUserDocRef = doc(db, 'users', newUser.uid);
    
    // Generate the new user's own referral code
    const ownReferralCode = `${displayName.replace(/\s+/g, '').substring(0, 4).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;

    const newUserProfile = {
        uid: newUser.uid,
        displayName: displayName,
        email: email,
        createdAt: new Date().toISOString(),
        referralCode: ownReferralCode, // Their own code
        referredBy: referrerId, // The UID of the person who referred them
        status: 'active' as const,
        referredUsers: [] // Array to store UIDs of users they refer
    };

    // 3. Save documents to Firestore
    if (referrerId && referrerDocRef) {
        // If there was a referrer, update both the new user and the referrer's document in a batch
        const batch = writeBatch(db);

        // Set the new user's document
        batch.set(newUserDocRef, newUserProfile);
        
        // Atomically update the referrer's document to add the new user's UID to their `referredUsers` array
        const referrerDocSnap = await getDoc(referrerDocRef);
        const referrerData = referrerDocSnap.data();
        const referredUsers = referrerData?.referredUsers || [];
        
        batch.update(referrerDocRef, {
            referredUsers: [...referredUsers, newUser.uid]
        });

        await batch.commit();

    } else {
        // Otherwise, just create the new user's document
        await setDoc(newUserDocRef, newUserProfile);
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
