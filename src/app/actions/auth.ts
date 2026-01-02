
'use server';

import { z } from 'zod';
import { initializeAdminApp } from '@/firebase/admin';
import admin from 'firebase-admin';

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  referralCode: z.string().optional(),
});

export async function signUpUser(prevState: any, formData: FormData) {
  const validatedFields = signupSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { success: false, message: 'Invalid form data.' };
  }
  
  initializeAdminApp();
  const auth = admin.auth();
  const db = admin.firestore();

  const { name, email, password, referralCode } = validatedFields.data;

  let referrerUid: string | null = null;

  // 1. Validate referral code if provided
  if (referralCode) {
    const usersRef = db.collection('users');
    // Correct way to query with firebase-admin
    const q = usersRef.where('referralCode', '==', referralCode.toUpperCase());
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return { success: false, message: 'Invalid referral code.' };
    }
    referrerUid = querySnapshot.docs[0].id;
  }

  try {
    // 2. Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    const newUserUid = userRecord.uid;

    // Ensure the referrer isn't the user themselves (edge case)
    if (referrerUid === newUserUid) {
      referrerUid = null;
    }

    // 3. Create user profile in Firestore within a transaction
    await db.runTransaction(async (transaction) => {
        const newUserRef = db.collection('users').doc(newUserUid);
        const displayName = name || "New User";

        const newUserProfileData = {
            displayName: displayName,
            email: email,
            createdAt: new Date().toISOString(),
            referralCode: `${displayName.replace(/\s+/g, '').substring(0, 4).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
            referredBy: referrerUid,
            status: 'active',
            referredUsers: []
        };
        transaction.set(newUserRef, newUserProfileData);

        // If there was a valid referrer, update their document
        if (referrerUid) {
            const referrerRef = db.collection('users').doc(referrerUid);
            const referrerDoc = await transaction.get(referrerRef);
            if (referrerDoc.exists) {
                const referredUsers = referrerDoc.data()?.referredUsers || [];
                transaction.update(referrerRef, {
                    referredUsers: [...referredUsers, newUserUid]
                });
            }
        }
    });

    return { success: true, message: 'Account created successfully!' };

  } catch (error: any) {
    let message = 'An unknown error occurred.';
    if (error.code === 'auth/email-already-exists') {
      message = 'This email is already in use. Please log in instead.';
    }
    return { success: false, message };
  }
}
