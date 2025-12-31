
'use server';

import { revalidatePath } from 'next/cache';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import type { Order } from '@/lib/types';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/firebase/admin';
import { headers } from 'next/headers';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

// This is a server-side verification using the Firebase Admin SDK
async function verifyAdmin() {
    const authorization = headers().get('Authorization');
    if (authorization?.startsWith('Bearer ')) {
        const idToken = authorization.split('Bearer ')[1];
        try {
            const decodedToken = await getAuth(adminApp).verifyIdToken(idToken);
            return decodedToken.email === ADMIN_EMAIL;
        } catch (error) {
            console.error('Error verifying admin token:', error);
            return false;
        }
    }
    return false;
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
