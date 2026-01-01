
'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import admin from 'firebase-admin';
import { initializeAdminApp } from '@/firebase/admin';
import type { Order, Service, Package, UserProfile } from '@/lib/types';
import { z } from 'zod';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

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


// --- SERVICES & PACKAGES ---

const serviceSchema = z.object({
  itemType: z.literal('Service'),
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  category: z.string(),
  price: z.coerce.number().positive(),
  priceType: z.enum(['starting', 'fixed']),
  deliveryTime: z.string(),
  inclusions: z.array(z.object({ value: z.string() })).transform(items => items.map(i => i.value).filter(Boolean)),
});

const packageSchema = z.object({
  itemType: z.literal('Package'),
  name: z.string().min(3),
  description: z.string().min(10),
  priceString: z.string(),
  features: z.array(z.object({ value: z.string() })).transform(items => items.map(i => i.value).filter(Boolean)),
});

const itemSchema = z.discriminatedUnion("itemType", [serviceSchema, packageSchema]);

export async function createServiceOrPackage(rawData: unknown) {
    await verifyAdmin();
    const db = admin.firestore();
    const validatedData = itemSchema.parse(rawData);

    if (validatedData.itemType === 'Service') {
        const { itemType, slug, ...serviceData } = validatedData;
        const serviceRef = db.collection('services').doc(slug);
        await serviceRef.set({ ...serviceData, id: slug, slug });
    } else {
        const { itemType, ...packageData } = validatedData;
        const slug = packageData.name.toLowerCase().replace(/\s+/g, '-');
        const packageRef = db.collection('comboPackages').doc(slug);
        await packageRef.set({ ...packageData, id: slug, price: packageData.priceString, slug });
    }
    revalidatePath('/admin/services');
}

const updateServiceSchema = serviceSchema.extend({ id: z.string() });
const updatePackageSchema = packageSchema.extend({ id: z.string() });
const updateItemSchema = z.discriminatedUnion("itemType", [updateServiceSchema, updatePackageSchema]);

export async function updateServiceOrPackage(rawData: unknown) {
    await verifyAdmin();
    const db = admin.firestore();
    const validatedData = updateItemSchema.parse(rawData);
    
    if (validatedData.itemType === 'Service') {
        const { itemType, id, ...serviceData } = validatedData;
        await db.collection('services').doc(id).update(serviceData);
    } else {
        const { itemType, id, ...packageData } = validatedData;
        await db.collection('comboPackages').doc(id).update({
            ...packageData,
            price: packageData.priceString
        });
    }
    revalidatePath('/admin/services');
    revalidatePath(`/admin/services/edit/${validatedData.id}`);
}


export async function deleteServiceOrPackage(data: { id: string, type: 'Service' | 'Package' }) {
    await verifyAdmin();
    const db = admin.firestore();
    const collectionName = data.type === 'Service' ? 'services' : 'comboPackages';
    await db.collection(collectionName).doc(data.id).delete();
    revalidatePath('/admin/services');
}
