'use server';

import { ai } from '@/ai/genkit';
import { initializeAdminApp } from '@/firebase/admin';
import { z } from 'zod';
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  Timestamp,
  startAt,
  where,
} from 'firebase/firestore';
import type { Order, UserProfile } from '@/lib/types';
import { sub, startOfDay, startOfWeek, startOfMonth } from 'date-fns';

const admin = initializeAdminApp();
const db = admin ? admin.firestore() : null;

export const listNewUsers = ai.defineTool(
  {
    name: 'listNewUsers',
    description: 'Get a list of the most recent users who have signed up. Can be filtered by a time frame.',
    input: {
      schema: z.object({
        count: z.number().default(5).describe("The number of users to retrieve."),
        timeframe: z.enum(['today', 'week', 'month', 'all']).default('all').describe("The time period to look for new users."),
      }),
    },
    output: { schema: z.array(z.custom<UserProfile>()) },
  },
  async (input) => {
    if (!db) throw new Error('Firestore not initialized.');

    let userQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc'),
      limit(input.count)
    );

    let startDate: Date | null = null;
    if (input.timeframe === 'today') {
        startDate = startOfDay(new Date());
    } else if (input.timeframe === 'week') {
        startDate = startOfWeek(new Date());
    } else if (input.timeframe === 'month') {
        startDate = startOfMonth(new Date());
    }
    
    if (startDate) {
        userQuery = query(userQuery, where('createdAt', '>=', startDate.toISOString()));
    }

    const snapshot = await getDocs(userQuery);
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => doc.data() as UserProfile);
  }
);


export const listRecentOrders = ai.defineTool(
  {
    name: 'listRecentOrders',
    description: 'Get a list of the most recent orders placed on the website. Can be filtered by count.',
    input: {
        schema: z.object({
            count: z.number().default(5).describe("The number of orders to retrieve."),
        })
    },
    output: { schema: z.array(z.custom<Order>()) },
  },
  async (input) => {
    if (!db) throw new Error('Firestore not initialized.');

    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('orderDate', 'desc'),
      limit(input.count)
    );

    const snapshot = await getDocs(ordersQuery);
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  }
);
