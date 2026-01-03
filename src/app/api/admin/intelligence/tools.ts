
'use server';

import { ai } from '@/ai/genkit';
import { initializeAdminApp } from '@/firebase/admin';
import { z } from 'zod';
import { collection, query, where, orderBy, limit, getDocs, addDoc } from 'firebase/firestore';
import type { Coupon, Order, UserProfile } from '@/lib/types';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays } from 'date-fns';

const db = initializeAdminApp().firestore();

export const listNewUsers = ai.defineTool(
  {
    name: 'listNewUsers',
    description: 'Get a list of the most recent users who have signed up.',
    input: {
      schema: z.object({
        count: z.number().optional().default(5).describe('The number of new users to retrieve.'),
      }),
    },
    output: {
      schema: z.array(
        z.object({
          uid: z.string(),
          displayName: z.string(),
          email: z.string(),
          createdAt: z.string(),
          referredBy: z.string().nullable(),
        })
      ),
    },
  },
  async ({ count }) => {
    console.log(`listNewUsers tool called with count: ${count}`);
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'), limit(count));

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => doc.data() as UserProfile).map(user => ({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      createdAt: user.createdAt,
      referredBy: user.referredBy || null,
    }));
  }
);


export const listRecentOrders = ai.defineTool(
  {
    name: 'listRecentOrders',
    description: 'Get a list of the most recent orders placed on the website.',
    input: {
      schema: z.object({
        count: z.number().optional().default(5).describe('The number of recent orders to retrieve.'),
      }),
    },
    output: {
      schema: z.array(
        z.object({
          id: z.string(),
          fullName: z.string(),
          email: z.string(),
          totalPrice: z.number().optional(),
          status: z.string(),
          paymentStatus: z.string(),
          orderDate: z.string(),
        })
      ),
    },
  },
  async ({ count }) => {
    console.log(`listRecentOrders tool called with count: ${count}`);
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('orderDate', 'desc'), limit(count));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)).map(order => ({
      id: order.id,
      fullName: order.fullName,
      email: order.email,
      totalPrice: order.totalPrice,
      status: order.status,
      paymentStatus: order.paymentStatus,
      orderDate: new Date(order.orderDate).toISOString(),
    }));
  }
);

export const getAppStatus = ai.defineTool(
    {
        name: 'getAppStatus',
        description: 'Provides a summary of key application metrics like total users, new users today, total orders, and total revenue for paid orders.',
        input: { schema: z.void() },
        output: { schema: z.object({
            totalUsers: z.number(),
            newUsersToday: z.number(),
            totalOrders: z.number(),
            totalRevenue: z.number(),
        })},
    },
    async () => {
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
);

export const createCoupon = ai.defineTool(
    {
        name: 'createCoupon',
        description: 'Creates a new discount coupon for customers.',
        input: {
            schema: z.object({
                code: z.string().describe("The unique code for the coupon, e.g., 'SUMMER20'."),
                discountType: z.enum(['percentage', 'fixed']).describe("The type of discount."),
                discountValue: z.number().describe("The numeric value of the discount (e.g., 20 for 20% or 500 for ₹500)."),
                daysUntilExpiry: z.number().default(30).describe("Number of days from now until the coupon expires."),
            })
        },
        output: { schema: z.object({ success: z.boolean(), code: z.string() }) },
    },
    async (input) => {
        console.log(`createCoupon tool called with input:`, input);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + input.daysUntilExpiry);

        const newCoupon: Omit<Coupon, 'id'> = {
            code: input.code.toUpperCase(),
            discountType: input.discountType,
            discountValue: input.discountValue,
            expiryDate: expiryDate.toISOString(),
            isActive: true,
            createdAt: new Date().toISOString(),
            currentUses: 0,
        };

        await addDoc(collection(db, 'coupons'), newCoupon);

        return { success: true, code: newCoupon.code };
    }
);
