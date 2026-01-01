
'use server';

import { revalidatePath } from 'next/cache';
import type { Order, Service, Package, UserProfile } from '@/lib/types';
import { z } from 'zod';
// Note: We are no longer using firebase-admin here for session verification in actions.
// Security is enforced by Firestore rules.

// This file is now primarily for actions that might need server-side logic in the future,
// like revalidation, but the core data manipulation is handled on the client
// with security guaranteed by Firestore rules.

// The update functions can be called from the client, but the Firestore rules
// will ensure only an admin can actually perform the write.

// Example of a revalidating action if you were using Server Components with server-side fetching.
// Currently, the admin panel uses client-side fetching, so revalidation is not strictly necessary
// as the UI will update in real-time. However, we keep these functions for good practice.

export async function updateOrderStatus(data: { orderId: string, newStatus: Order['status'] }) {
    // No explicit verification needed here because Firestore rules handle it.
    // The client-side code will attempt a write, and it will only succeed if the user is an admin.
    revalidatePath('/admin/orders');
    revalidatePath('/admin/dashboard');
}

export async function updatePaymentStatus(data: { orderId: string, newStatus: Order['paymentStatus'] }) {
    revalidatePath('/admin/orders');
    revalidatePath('/admin/dashboard');
}

export async function updateUserStatus(data: { userId: string, newStatus: 'active' | 'blocked' }) {
    revalidatePath('/admin/users');
}

export async function deleteUser(data: { uid: string }) {
    // Important: Deleting a user from Auth still requires the Admin SDK.
    // However, for this to work, it must be called from a secure backend environment
    // where credentials are properly configured.
    // For now, this action will primarily handle revalidation. The client will handle the delete operation.
    revalidatePath('/admin/users');
}
