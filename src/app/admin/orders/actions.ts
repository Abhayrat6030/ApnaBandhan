
'use server';

import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import type { Order } from '@/lib/types';


export async function updateOrderStatus(orderId: string, status: Order['status']) {
    const user = auth.currentUser;
    if (user?.email !== 'abhayrat603@gmail.com') {
      return { success: false, error: 'Unauthorized. You do not have permission to perform this action.' };
    }

    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { status });
        return { success: true };
    } catch (error: any) {
        console.error("Firestore update error:", error);
        return { success: false, error: error.message || 'Failed to update status.' };
    }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']) {
    const user = auth.currentUser;
    if (user?.email !== 'abhayrat603@gmail.com') {
      return { success: false, error: 'Unauthorized. You do not have permission to perform this action.' };
    }
    
    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { paymentStatus });
        return { success: true };
    } catch (error: any) {
        console.error("Firestore update error:", error);
        return { success: false, error: error.message || 'Failed to update payment status.' };
    }
}
