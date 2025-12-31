
'use server';

import { revalidatePath } from 'next/cache';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import type { Order } from '@/lib/types';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/firebase/admin';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

// This is a server-side verification using the Firebase Admin SDK
async function verifyAdmin(idToken: string | undefined) {
    // If adminApp is not initialized or no token is provided, deny access.
    if (!adminApp || !idToken) {
        console.warn("Cannot verify admin: Firebase Admin SDK not initialized or no token provided.");
        return false;
    }

    try {
        const decodedToken = await getAuth(adminApp).verifyIdToken(idToken);
        return decodedToken.email === ADMIN_EMAIL;
    } catch (error) {
        console.error('Error verifying admin token:', error);
        return false;
    }
}


export async function updateOrderStatus(idToken: string | undefined, orderId: string, status: Order['status']) {
    const isAdmin = await verifyAdmin(idToken);

    if (!isAdmin) {
        return { success: false, error: 'Unauthorized. You do not have permission to perform this action.' };
    }

    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status });
        revalidatePath('/admin/orders');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to update status.' };
    }
}

export async function updatePaymentStatus(idToken: string | undefined, orderId: string, paymentStatus: Order['paymentStatus']) {
    const isAdmin = await verifyAdmin(idToken);

    if (!isAdmin) {
        return { success: false, error: 'Unauthorized. You do not have permission to perform this action.' };
    }

    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { paymentStatus });
        revalidatePath('/admin/orders');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to update payment status.' };
    }
}
