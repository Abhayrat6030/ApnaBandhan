
'use server';

import { initializeAdminApp } from "@/firebase/admin";
import { z } from 'zod';

// defineTool was a remnant from a previous implementation and is not needed.
// These are simple async functions that the main route calls.

/**
 * Tool to list the most recent users who signed up.
 */
export async function listNewUsers({ count = 5 }: { count?: number } = {}) {
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


/**
 * Tool to list the most recent orders.
 */
export async function listRecentOrders({ count = 5 }: { count?: number } = {}) {
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

/**
 * Tool to get the general status of the application (total users/orders).
 */
export async function getAppStatus() {
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
