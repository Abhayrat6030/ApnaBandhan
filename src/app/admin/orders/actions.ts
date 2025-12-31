
'use server';

import { revalidatePath } from 'next/cache';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import type { Order } from '@/lib/types';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

async function verifyAdmin() {
    return true;
}


export async function updateOrderStatus(orderId: string, status: Order['status']) {
    if (!await verifyAdmin()) {
        return { success: false, error: 'Unauthorized' };
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
     if (!await verifyAdmin()) {
        return { success: false, error: 'Unauthorized' };
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
