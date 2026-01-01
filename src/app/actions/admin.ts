
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

// --- DASHBOARD ---
export async function getAdminDashboardData() {
    await verifyAdmin();
    const db = admin.firestore();

    const ordersSnapshot = await db.collection('orders').get();
    const allOrders: Order[] = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    
    const servicesSnapshot = await db.collection('services').get();
    const packagesSnapshot = await db.collection('comboPackages').get();
    const allServices = servicesSnapshot.docs.map(doc => doc.data());
    const allPackages = packagesSnapshot.docs.map(doc => doc.data());
    
    const serviceMap = new Map([...allServices, ...allPackages].map(item => [item.id || item.slug, item]));

    const totalRevenue = allOrders.reduce((acc, order) => {
        if (order.paymentStatus === 'Paid') {
            const serviceOrPackage = serviceMap.get(order.selectedServiceId);
            if (serviceOrPackage) {
                let price = 0;
                if (typeof serviceOrPackage.price === 'number') {
                    price = serviceOrPackage.price;
                } else if (typeof serviceOrPackage.price === 'string') {
                    price = parseFloat(serviceOrPackage.price.replace(/[^0-9.-]+/g, ''));
                }
                return acc + price;
            }
        }
        return acc;
    }, 0);

    const recentOrdersSnapshot = await db.collection('orders').orderBy('orderDate', 'desc').limit(5).get();
    const recentOrders = recentOrdersSnapshot.docs.map(doc => {
        const order = { id: doc.id, ...doc.data() } as Order;
        return {
            ...order,
            serviceName: serviceMap.get(order.selectedServiceId)?.name || 'Unknown Service',
        };
    });

    return {
        stats: {
            totalRevenue,
            totalOrders: allOrders.length,
            completedOrders: allOrders.filter(o => o.status === 'Delivered').length,
        },
        recentOrders,
    };
}


// --- ORDERS ---
export async function getAllOrders() {
    await verifyAdmin();
    const db = admin.firestore();
    const ordersSnapshot = await db.collection('orders').orderBy('orderDate', 'desc').get();
    
    const servicesSnapshot = await db.collection('services').get();
    const packagesSnapshot = await db.collection('comboPackages').get();
    const allServices = servicesSnapshot.docs.map(doc => doc.data());
    const allPackages = packagesSnapshot.docs.map(doc => doc.data());
    const serviceMap = new Map([...allServices, ...allPackages].map(item => [item.id || item.slug, item.name]));

    return ordersSnapshot.docs.map(doc => {
        const order = { id: doc.id, ...doc.data() } as Order;
        return {
            ...order,
            serviceName: serviceMap.get(order.selectedServiceId) || 'Unknown Service',
        };
    });
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

// --- USERS ---
export async function getAllUsers() {
    await verifyAdmin();
    const db = admin.firestore();
    const usersSnapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = usersSnapshot.docs.map(doc => doc.data() as UserProfile);
    const usersMap = new Map(users.map(u => [u.uid, u]));
    return { users, usersMap };
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

export async function getAllServicesAndPackages() {
    await verifyAdmin();
    const db = admin.firestore();
    const servicesSnapshot = await db.collection('services').get();
    const packagesSnapshot = await db.collection('comboPackages').get();

    const services = servicesSnapshot.docs.map(doc => ({ ...doc.data(), type: 'Service', id: doc.id } as Service & { type: 'Service'}));
    const packages = packagesSnapshot.docs.map(doc => ({ ...doc.data(), type: 'Package', id: doc.id } as Package & { type: 'Package'}));

    const allItems = [...services, ...packages].map(item => ({
        ...item,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.-]+/g, '')) : item.price,
    }));
    
    return allItems.sort((a,b) => (a.name || '').localeCompare(b.name || ''));
}

export async function getServiceOrPackage(slug: string) {
    await verifyAdmin();
    const db = admin.firestore();

    const serviceDoc = await db.collection('services').doc(slug).get();
    if (serviceDoc.exists) {
        return { ...serviceDoc.data(), id: serviceDoc.id, type: 'Service' } as Service & { type: 'Service' };
    }

    const packageDoc = await db.collection('comboPackages').doc(slug).get();
    if (packageDoc.exists) {
        return { ...packageDoc.data(), id: packageDoc.id, type: 'Package' } as Package & { type: 'Package' };
    }

    return null;
}
