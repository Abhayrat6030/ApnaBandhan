'use server';

import { getAuth } from 'firebase-admin/auth';
import { getApp } from 'firebase-admin/app';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email(),
});

type FormValues = z.infer<typeof formSchema>;

export async function handlePasswordReset(values: FormValues) {
  try {
    const auth = getAuth(getApp());
    // The Admin SDK doesn't have a direct equivalent of `sendPasswordResetEmail`.
    // Instead, you generate a link and send it using your own email service.
    // This is a more secure approach for server environments.
    const link = await auth.generatePasswordResetLink(values.email);

    // In a real application, you would use an email service (like SendGrid, Mailgun, etc.)
    // to send this link to the user.
    console.log('Password Reset Link (for demo purposes):', link);
    // For this prototype, we'll assume the email is sent successfully.
    
    return { success: true };
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred.";
    if (error.code === 'auth/user-not-found') {
      // For security, don't reveal that the user doesn't exist.
      // The client-side will show a generic success message.
      console.warn(`Password reset attempted for non-existent user: ${values.email}`);
      return { success: true }; // Still return success to the client
    }
    console.error('Password reset error:', error);
    errorMessage = error.message || errorMessage;
    return { success: false, error: errorMessage };
  }
}
