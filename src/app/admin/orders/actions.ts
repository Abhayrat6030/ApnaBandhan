
'use server';

import { revalidatePath } from 'next/cache';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import type { Order } from '@/lib/types';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/firebase/admin';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

// This is a server-side verification using the Firebase Admin SDK
async function verifyAdmin() {
    try {
        const currentUser = auth.currentUser;
        if (currentUser?.email === ADMIN_EMAIL) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Admin verification failed", error);
        return false;
    }
}


export async function updateOrderStatus(orderId: string, status: Order['status']) {
    const isAdmin = await verifyAdmin();
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

export async function updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']) {
     const isAdmin = await verifyAdmin();
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
