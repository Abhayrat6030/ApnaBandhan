
'use server';
import { ai } from '@/ai/genkit';
import { initializeAdminApp } from '@/firebase/admin';
import { z } from 'zod';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import type { Coupon, Service, Package } from '@/lib/types';

export const listServices = ai.defineTool(
  {
    name: 'listServices',
    description: 'List available services and packages.',
    input: { schema: z.void() },
    output: {
      schema: z.array(
        z.object({
          name: z.string(),
          price: z.number().or(z.string()),
          description: z.string(),
        })
      ),
    },
  },
  async () => {
    console.log('listServices tool called');
    const admin = initializeAdminApp();
    if (!admin) {
      throw new Error('Firebase Admin SDK not initialized.');
    }
    const db = admin.firestore();

    const servicesSnapshot = await getDocs(collection(db, 'services'));
    const packagesSnapshot = await getDocs(collection(db, 'comboPackages'));

    const services = servicesSnapshot.docs.map((doc) => {
      const data = doc.data() as Service;
      return {
        name: data.name,
        price: data.price,
        description: data.description,
      };
    });

    const packages = packagesSnapshot.docs.map((doc) => {
      const data = doc.data() as Package;
      return {
        name: data.name,
        price: data.price,
        description: data.description,
      };
    });

    return [...services, ...packages];
  }
);

export const listCoupons = ai.defineTool(
  {
    name: 'listCoupons',
    description:
      'List available, active, and non-expired discount coupons. Used when a user asks for a discount.',
    input: { schema: z.void() },
    output: {
      schema: z.array(
        z.object({
          code: z.string(),
          discountType: z.string(),
          discountValue: z.number(),
          expiryDate: z.string(),
        })
      ),
    },
  },
  async () => {
    console.log('listCoupons tool called');
    const admin = initializeAdminApp();
    if (!admin) {
      throw new Error('Firebase Admin SDK not initialized.');
    }
    const db = admin.firestore();

    const couponsRef = collection(db, 'coupons');
    const q = query(
      couponsRef,
      where('isActive', '==', true),
      where('expiryDate', '>', new Date().toISOString()),
      orderBy('expiryDate', 'asc'),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map((doc) => {
      const data = doc.data() as Coupon;
      return {
        code: data.code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        expiryDate: data.expiryDate,
      };
    });
  }
);
