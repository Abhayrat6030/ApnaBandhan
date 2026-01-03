import { initializeAdminApp } from '@/firebase/admin';
import { z } from 'zod';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import type { UserProfile, Order } from '@/lib/types';
import { sub, startOfToday, startOfYesterday, startOfWeek, startOfMonth } from 'date-fns';

const timeFrameSchema = z.enum(["today", "yesterday", "this week", "this month", "all time"]).optional().default("this week");

// Helper to get date range
function getDateRange(timeFrame: z.infer<typeof timeFrameSchema>) {
    const now = new Date();
    switch(timeFrame) {
        case 'today':
            return { start: startOfToday(), end: now };
        case 'yesterday':
            const yesterdayStart = startOfYesterday();
            return { start: yesterdayStart, end: sub(startOfToday(), {seconds: 1}) };
        case 'this week':
            return { start: startOfWeek(now), end: now };
        case 'this month':
            return { start: startOfMonth(now), end: now };
        case 'all time':
            return { start: new Date(0), end: now };
        default:
            return { start: startOfWeek(now), end: now };
    }
}


// Tool for listing new users
const listNewUsersDefinition = {
  type: 'function' as const,
  function: {
    name: 'listNewUsers',
    description: 'Retrieves a list of newly registered users within a specified timeframe.',
    parameters: {
        type: "object",
        properties: {
             limit: { type: "number", description: 'The maximum number of users to retrieve. Defaults to 10.'},
             timeFrame: { type: "string", enum: ["today", "yesterday", "this week", "this month", "all time"], description: 'The time frame to look for new users. Defaults to "this week".'},
        },
        required: []
    }
  }
};

async function listNewUsersExecute({ limit: count = 10, timeFrame = 'this week' }: z.infer<z.ZodObject<{limit: z.ZodOptional<z.ZodNumber>, timeFrame: z.ZodOptional<z.ZodEnum<["today", "yesterday", "this week", "this month", "all time"]>>}>>) {
  const admin = initializeAdminApp();
  if (!admin) throw new Error('Admin SDK not initialized');
  const db = admin.firestore();

  const { start } = getDateRange(timeFrame);
  
  const usersRef = collection(db, 'users');
  const q = query(
    usersRef,
    where('createdAt', '>=', start.toISOString()),
    orderBy('createdAt', 'desc'),
    limit(count)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return { message: `No new users found for timeframe: ${timeFrame}.` };
  }
  const users = snapshot.docs.map(doc => {
      const data = doc.data() as UserProfile;
      // Return a subset of user data for conciseness
      return {
          displayName: data.displayName,
          email: data.email,
          createdAt: data.createdAt,
          referredBy: data.referredBy,
      }
  });
  return { users };
}

export const listNewUsers = {
    definition: listNewUsersDefinition,
    execute: listNewUsersExecute
};

// Tool for listing recent orders
const listRecentOrdersDefinition = {
  type: 'function' as const,
  function: {
      name: 'listRecentOrders',
      description: 'Retrieves a list of recent orders within a specified timeframe.',
      parameters: {
          type: "object",
          properties: {
             limit: { type: "number", description: 'The maximum number of orders to retrieve. Defaults to 10.'},
             timeFrame: { type: "string", enum: ["today", "yesterday", "this week", "this month", "all time"], description: 'The time frame to look for recent orders. Defaults to "this week".'},
          },
          required: []
      }
  }
};

async function listRecentOrdersExecute({ limit: count = 10, timeFrame = 'this week' }: z.infer<z.ZodObject<{limit: z.ZodOptional<z.ZodNumber>, timeFrame: z.ZodOptional<z.ZodEnum<["today", "yesterday", "this week", "this month", "all time"]>>}>>) {
  const admin = initializeAdminApp();
  if (!admin) throw new Error('Admin SDK not initialized');
  const db = admin.firestore();
  
  const { start } = getDateRange(timeFrame);

  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('orderDate', '>=', start.toISOString()),
    orderBy('orderDate', 'desc'),
    limit(count)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return { message: `No recent orders found for timeframe: ${timeFrame}.` };
  }
  const orders = snapshot.docs.map(doc => {
      const data = doc.data() as Order;
      // Return a subset of order data
      return {
          orderId: doc.id,
          fullName: data.fullName,
          orderDate: data.orderDate,
          totalPrice: data.totalPrice,
          status: data.status,
      }
  });
  return { orders };
}

export const listRecentOrders = {
    definition: listRecentOrdersDefinition,
    execute: listRecentOrdersExecute,
};


// General App Status Tool
const AppStatusToolDefinition = {
  type: 'function' as const,
  function: {
      name: 'AppStatusTool',
      description: 'Provides a summary of application status for a given day, including new users, new orders, and total revenue.',
      parameters: {
          type: 'object',
          properties: {
            timeFrame: { type: "string", enum: ["today", "yesterday", "this week", "this month"], default: "today", description: "The timeframe to get the status for."},
          },
          required: ['timeFrame']
      },
  }
};

async function AppStatusToolExecute({ timeFrame }: z.infer<z.ZodObject<{timeFrame: z.ZodEnum<["today", "yesterday", "this week", "this month"]>}>>) {
  const admin = initializeAdminApp();
  if (!admin) throw new Error('Admin SDK not initialized');
  const db = admin.firestore();
  
  const { start, end } = getDateRange(timeFrame);

  // Get new users
  const usersQuery = query(
    collection(db, 'users'),
    where('createdAt', '>=', start.toISOString()),
    where('createdAt', '<=', end.toISOString())
  );
  const usersSnapshot = await getDocs(usersQuery);
  const newUsersCount = usersSnapshot.size;

  // Get new orders and revenue
  const ordersQuery = query(
    collection(db, 'orders'),
    where('orderDate', '>=', start.toISOString()),
    where('orderDate', '<=', end.toISOString())
  );
  const ordersSnapshot = await getDocs(ordersQuery);
  const newOrdersCount = ordersSnapshot.size;
  
  let totalRevenue = 0;
  ordersSnapshot.forEach(doc => {
      const order = doc.data() as Order;
      if (order.paymentStatus === 'Paid' && order.totalPrice) {
          totalRevenue += order.totalPrice;
      }
  });

  return {
      newUsers: newUsersCount,
      newOrders: newOrdersCount,
      totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
      timeFrame: timeFrame,
  };
}

export const AppStatusTool = {
    definition: AppStatusToolDefinition,
    execute: AppStatusToolExecute,
};
