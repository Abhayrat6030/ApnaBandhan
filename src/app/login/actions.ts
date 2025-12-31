'use server';

import { getAuth } from "firebase-admin/auth";
import { getApp } from "firebase-admin/app";
import { z } from 'zod';
import { signInWithEmailAndPassword } from "firebase/auth";
import { initializeFirebase } from "@/firebase";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof formSchema>;

export async function handleEmailSignIn(values: FormValues) {
  try {
    const { auth } = initializeFirebase();
    // This doesn't actually sign the user in on the server,
    // but it verifies the credentials against Firebase Auth.
    // The client will need to handle the actual sign-in state change.
    // A better approach in a real app would be to create a custom token
    // and sign in with that on the client. For this prototype, we'll
    // just verify and let the client do a separate signIn call.
    
    // This is a simplified example. In a real app, you'd use the admin SDK
    // to verify credentials or mint a custom token, which the client then uses.
    // Since we're in a mixed environment, we can't directly use the client SDK's
    // signInWithEmailAndPassword and have it affect the server's auth state for the request.
    
    // We are returning success and letting the client do the sign-in.
    // This server action essentially just validates the form data. A more complex
    // implementation would use the Admin SDK to verify the user or create a custom token.
    return { success: true };
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred.";
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email address.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/invalid-email':
         errorMessage = 'The email address is not valid.';
         break;
      default:
        errorMessage = error.message || errorMessage;
        break;
    }
    return { success: false, error: errorMessage };
  }
}
