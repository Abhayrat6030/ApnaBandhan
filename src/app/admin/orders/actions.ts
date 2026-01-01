
'use server';

import { updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/admin';
import type { Order } from '@/lib/types';
import { verifyAdmin } from '@/lib/admin-auth';


export async function updateOrderStatus(orderId: string, status: Order['status']) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            return { success: false, error: 'Unauthorized. You do not have permission to perform this action.' };
        }
        
        const orderRef = db.collection('orders').doc(orderId);
        await orderRef.update({ status });
        
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to update status.' };
    }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']) {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            return { success: false, error: 'Unauthorized. You do not have permission to perform this action.' };
        }
        
        const orderRef = db.collection('orders').doc(orderId);
        await orderRef.update({ paymentStatus });
        
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to update payment status.' };
    }
}
