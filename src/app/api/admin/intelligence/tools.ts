
'use server';

import { initializeAdminApp } from "@/firebase/admin";
import { z } from 'zod';
import { defineTool } from 'genkit'; // Using a similar pattern for structure

/**
 * Tool to list the most recent users who signed up.
 */
export const listNewUsers = defineTool(
  {
    name: 'listNewUsers',
    description: 'Get a list of the most recent users who have signed up.',
    inputSchema: z.object({
      count: z.number().optional().default(5).describe('The number of users to fetch.'),
    }),
    outputSchema: z.any(),
  },
  async ({ count }) => {
    try {
      const admin = initializeAdminApp();
      const firestore = admin.firestore();
      const usersSnapshot = await firestore.collection('users').orderBy('createdAt', 'desc').limit(count).get();
      if (usersSnapshot.empty) {
        return { message: "No new users found." };
      }
      const users = usersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
              name: data.displayName,
              email: data.email,
              joined: new Date(data.createdAt).toLocaleDateString(),
          }
      });
      return { users };
    } catch (error: any) {
        console.error("Error in listNewUsers tool:", error);
        return { error: `Failed to fetch new users: ${error.message}` };
    }
  }
);


/**
 * Tool to list the most recent orders.
 */
export const listRecentOrders = defineTool(
  {
    name: 'listRecentOrders',
    description: 'Get a list of the most recent orders placed.',
    inputSchema: z.object({
      count: z.number().optional().default(5).describe('The number of orders to fetch.'),
    }),
    outputSchema: z.any(),
  },
  async ({ count }) => {
    try {
      const admin = initializeAdminApp();
      const firestore = admin.firestore();
      const ordersSnapshot = await firestore.collection('orders').orderBy('orderDate', 'desc').limit(count).get();
      if (ordersSnapshot.empty) {
          return { message: "No recent orders found." };
      }
      const orders = ordersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
              orderId: doc.id,
              customer: data.fullName,
              status: data.status,
              paymentStatus: data.paymentStatus,
              service: data.selectedServiceId,
              date: new Date(data.orderDate.toDate()).toLocaleDateString(),
          }
      });
      return { orders };
    } catch (error: any) {
        console.error("Error in listRecentOrders tool:", error);
        return { error: `Failed to fetch recent orders: ${error.message}` };
    }
  }
);

/**
 * Tool to get the general status of the application (total users/orders).
 */
export const getAppStatus = defineTool(
  {
    name: 'getAppStatus',
    description: 'Get the general status of the app, like total user and order counts.',
    inputSchema: z.object({}),
    outputSchema: z.any(),
  },
  async () => {
    try {
      const admin = initializeAdminApp();
      const firestore = admin.firestore();
      const usersSnapshot = await firestore.collection('users').get();
      const ordersSnapshot = await firestore.collection('orders').get();

      return {
          totalUsers: usersSnapshot.size,
          totalOrders: ordersSnapshot.size,
      };
    } catch (error: any) {
        console.error("Error in getAppStatus tool:", error);
        return { error: `Failed to fetch app status: ${error.message}` };
    }
  }
);
