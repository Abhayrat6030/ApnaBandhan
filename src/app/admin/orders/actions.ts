
'use server';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import type { Order } from '@/lib/types';


export async function updateOrderStatus(orderId: string, status: Order['status']) {
    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status });
        return { success: true };
    } catch (error: any) {
        console.error("Firestore update error:", error);
        return { success: false, error: error.message || 'Failed to update status. You may not have permission.' };
    }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']) {
    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { paymentStatus });
        return { success: true };
    } catch (error: any) {
        console.error("Firestore update error:", error);
        return { success: false, error: error.message || 'Failed to update payment status. You may not have permission.' };
    }
}
