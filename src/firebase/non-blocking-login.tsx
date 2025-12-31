
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
export function initiateEmailSignUp(
    authInstance: Auth, 
    email: string, 
    password: string, 
    displayName: string,
    onSuccess: () => void,
    onError: (error: any) => void
) {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => {
        if (userCredential.user) {
            updateProfile(userCredential.user, { displayName }).then(() => {
                const userDocRef = doc(db, 'users', userCredential.user.uid);
                
                const userProfile = {
                    uid: userCredential.user.uid,
                    displayName: displayName,
                    email: email,
                    createdAt: new Date().toISOString(),
                };

                setDoc(userDocRef, userProfile).then(() => {
                    onSuccess();
                }).catch(dbError => {
                    onError(dbError);
                });
                
            }).catch(profileError => {
                onError(profileError);
            });
        }
    })
    .catch(error => {
        onError(error);
    });
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
