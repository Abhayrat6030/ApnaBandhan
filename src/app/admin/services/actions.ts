'use server';

import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import type { Service, Package } from '@/lib/types';
import { z } from 'zod';
import { verifyAdmin } from '@/lib/admin-auth';

const formSchema = z.object({
  itemType: z.enum(['service', 'package']),
  name: z.string().min(3),
  slug: z.string().optional(),
  description: z.string().min(10),
  // Service fields
  category: z.string().optional(),
  price: z.coerce.number().optional(),
  priceType: z.enum(['starting', 'fixed']).optional(),
  deliveryTime: z.string().optional(),
  inclusions: z.array(z.object({ value: z.string() })).optional(),
  // Package fields
  priceString: z.string().optional(),
  features: z.array(z.object({ value: z.string() })).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export async function addService(data: FormValues) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Unauthorized' };
    }
    
    const parseResult = formSchema.safeParse(data);
    if (!parseResult.success) {
      return { success: false, error: 'Invalid data provided.' };
    }
    
    const { itemType, name, slug, description, ...rest } = parseResult.data;

    if (itemType === 'service') {
        const newService: Omit<Service, 'id' | 'samples' | 'isFeatured' | 'topRated' | 'rating' | 'tags' | 'originalPrice'> = {
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
            description,
            category: rest.category as any || 'invitation-cards',
            price: rest.price || 0,
            priceType: rest.priceType || 'fixed',
            inclusions: rest.inclusions?.map(i => i.value).filter(Boolean) || [],
            deliveryTime: rest.deliveryTime || 'N/A',
        };
        await setDoc(doc(db, 'services', newService.slug), newService);
    } else { // package
        const newPackage: Omit<Package, 'id' | 'isBestValue'> = {
            name,
            description,
            price: rest.priceString || '₹0',
            features: rest.features?.map(f => f.value).filter(Boolean) || [],
        };
        const packageSlug = name.toLowerCase().replace(/\s+/g, '-');
        await setDoc(doc(db, 'comboPackages', packageSlug), newPackage);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateService(id: string, data: FormValues) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return { success: false, error: 'Unauthorized' };
    }

    const parseResult = formSchema.safeParse(data);
    if (!parseResult.success) {
      return { success: false, error: 'Invalid data provided.' };
    }

    const { itemType, name, slug, description, ...rest } = parseResult.data;

    if (itemType === 'service') {
      const serviceRef = doc(db, 'services', id);
      const serviceData: Partial<Service> = {
        name,
        description,
        category: rest.category as any,
        price: rest.price,
        priceType: rest.priceType,
        deliveryTime: rest.deliveryTime,
        inclusions: rest.inclusions?.map(i => i.value).filter(Boolean),
      };
      await updateDoc(serviceRef, serviceData);
    } else { // package
      const packageRef = doc(db, 'comboPackages', id);
       const packageData: Partial<Package> = {
        name,
        description,
        price: rest.priceString,
        features: rest.features?.map(f => f.value).filter(Boolean),
      };
      await updateDoc(packageRef, packageData);
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteItem(itemId: string, itemType: 'Service' | 'Package') {
    try {
        const isAdmin = await verifyAdmin();
        if (!isAdmin) {
            return { success: false, error: 'Unauthorized' };
        }

        const collectionName = itemType === 'Service' ? 'services' : 'comboPackages';
        await deleteDoc(doc(db, collectionName, itemId));
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || 'Failed to delete item.' };
    }
}
