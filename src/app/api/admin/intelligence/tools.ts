
'use server';

import { initializeAdminApp } from '@/firebase/admin';
import { z } from 'zod';
import { collection, query, where, orderBy, limit, getDocs, addDoc } from 'firebase/firestore';
import type { Coupon, Order, UserProfile } from '@/lib/types';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';

const getDb = () => {
    try {
        return initializeAdminApp().firestore();
    } catch (e) {
        console.error("Failed to get Firestore instance in tools:", e);
        throw new Error("Could not connect to the database. Admin SDK might not be initialized.");
    }
}

export async function listNewUsers({ count = 5 }: { count?: number } = {}) {
    const db = getDb();
    console.log(`listNewUsers tool called with count: ${count}`);
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'), limit(count));

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return [];
    }
    const users = snapshot.docs.map(doc => doc.data() as UserProfile);
    return users.map(user => ({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      createdAt: user.createdAt,
      referredBy: user.referredBy || null,
    }));
}

export async function listRecentOrders({ count = 5 }: { count?: number } = {}) {
    const db = getDb();
    console.log(`listRecentOrders tool called with count: ${count}`);
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('orderDate', 'desc'), limit(count));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    return orders.map(order => ({
      id: order.id,
      fullName: order.fullName,
      email: order.email,
      totalPrice: order.totalPrice,
      status: order.status,
      paymentStatus: order.paymentStatus,
      orderDate: new Date(order.orderDate as string).toISOString(),
    }));
}

export async function getAppStatus() {
    const db = getDb();
    console.log("getAppStatus tool called");
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const usersSnapshot = await getDocs(collection(db, 'users'));
    const newUsersQuery = query(collection(db, 'users'), where('createdAt', '>=', todayStart.toISOString()));
    const newUsersSnapshot = await getDocs(newUsersQuery);

    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    const paidOrdersQuery = query(collection(db, 'orders'), where('paymentStatus', '==', 'Paid'));
    const paidOrdersSnapshot = await getDocs(paidOrdersQuery);

    let totalRevenue = 0;
    paidOrdersSnapshot.forEach(doc => {
        const order = doc.data() as Order;
        totalRevenue += order.totalPrice || 0;
    });

    return {
        totalUsers: usersSnapshot.size,
        newUsersToday: newUsersSnapshot.size,
        totalOrders: ordersSnapshot.size,
        totalRevenue: totalRevenue,
    };
}

export async function createCoupon({ code, discountType, discountValue, daysUntilExpiry = 30 }: { code: string, discountType: 'percentage' | 'fixed', discountValue: number, daysUntilExpiry?: number }) {
    const db = getDb();
    console.log(`createCoupon tool called with input:`, { code, discountType, discountValue, daysUntilExpiry });
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysUntilExpiry);

    const newCoupon: Omit<Coupon, 'id'> = {
        code: code.toUpperCase(),
        discountType: discountType,
        discountValue: discountValue,
        expiryDate: expiryDate.toISOString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        currentUses: 0,
        maxUses: undefined
    };

    await addDoc(collection(db, 'coupons'), newCoupon);

    return { success: true, code: newCoupon.code, expiryDate: newCoupon.expiryDate };
}
