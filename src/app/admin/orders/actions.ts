'use server';

import { revalidatePath } from 'next/cache';
import { doc, updateDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Order } from '@/lib/types';

const ADMIN_EMAIL = 'abhayrat603@gmail.com'; // Move to a secure place later

// This is a simplified check. In a real app, use Firebase Auth server-side verification.
async function verifyAdmin() {
    // In a real scenario, you'd get the user from the session/token
    // For this prototype, we'll assume if the action is called, the user is admin
    // This is NOT secure for production.
    return true;
}


export async function updateOrderStatus(orderId: string, status: Order['status']) {
    if (!await verifyAdmin()) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const { firestore } = initializeFirebase();
        const orderRef = doc(firestore, 'orders', orderId);
        await updateDoc(orderRef, { status });
        revalidatePath('/admin/orders');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to update status.' };
    }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']) {
     if (!await verifyAdmin()) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const { firestore } = initializeFirebase();
        const orderRef = doc(firestore, 'orders', orderId);
        await updateDoc(orderRef, { paymentStatus });
        revalidatePath('/admin/orders');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to update payment status.' };
    }
}
