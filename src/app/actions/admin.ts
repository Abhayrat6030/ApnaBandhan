
'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';
import { initializeAdminApp } from '@/firebase/admin';
import type { Order, Service, Package, UserProfile } from '@/lib/types';
import { z } from 'zod';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

// This function remains to verify session for actions that MUST be on the server.
async function verifyAdmin(): Promise<admin.auth.DecodedIdToken> {
    initializeAdminApp();
    const sessionCookie = cookies().get('__session')?.value;
    if (!sessionCookie) {
        throw new Error('Unauthorized: No session cookie.');
    }
    try {
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        if (decodedClaims.email !== ADMIN_EMAIL) {
            throw new Error('Forbidden: User is not an admin.');
        }
        return decodedClaims;
    } catch (error) {
        throw new Error('Unauthorized: Invalid session.');
    }
}


export async function updateOrderStatus(data: { orderId: string, newStatus: Order['status'] }) {
    await verifyAdmin();
    const db = admin.firestore();
    await db.collection('orders').doc(data.orderId).update({ status: data.newStatus });
    revalidatePath('/admin/orders');
    revalidatePath('/admin/dashboard');
}

export async function updatePaymentStatus(data: { orderId: string, newStatus: Order['paymentStatus'] }) {
    await verifyAdmin();
    const db = admin.firestore();
    await db.collection('orders').doc(data.orderId).update({ paymentStatus: data.newStatus });
    revalidatePath('/admin/orders');
    revalidatePath('/admin/dashboard');
}

export async function updateUserStatus(data: { userId: string, newStatus: 'active' | 'blocked' }) {
    await verifyAdmin();
    const db = admin.firestore();
    await db.collection('users').doc(data.userId).update({ status: data.newStatus });
    revalidatePath('/admin/users');
}

export async function deleteUser(data: { uid: string }) {
    await verifyAdmin();
    const db = admin.firestore();
    await admin.auth().deleteUser(data.uid);
    await db.collection('users').doc(data.uid).delete();
    revalidatePath('/admin/users');
}
