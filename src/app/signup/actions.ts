'use server';

import { z } from 'zod';
import { getApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof formSchema>;

export async function handleSignUp(values: FormValues) {
  try {
    const auth = getAuth(getApp());
    const userRecord = await auth.createUser({
      email: values.email,
      password: values.password,
      displayName: values.name,
    });
    
    // In a real app, you would likely mint a custom token here,
    // return it to the client, and the client would use signInWithCustomToken.
    // For this prototype, we'll return success and the client will perform a separate
    // signInWithEmailAndPassword call after successful signup.
    return { success: true, uid: userRecord.uid };
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred.";
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'This email is already in use by another account.';
    } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
    } else if (error.code === 'auth/weak-password') {
        errorMessage = 'The password is too weak. Please choose a stronger password.';
    } else {
        errorMessage = error.message || errorMessage;
    }
    return { success: false, error: errorMessage };
  }
}
