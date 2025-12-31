
'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/firebase';
import type { Service, Package } from '@/lib/types';
import { z } from 'zod';

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

async function verifyAdmin() {
    // This is a placeholder. In a real app, you'd use a more robust method
    // like checking a custom claim from the user's ID token.
    return auth.currentUser?.email === 'abhayrat603@gmail.com';
}

export async function addService(data: FormValues) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return { success: false, error: 'Unauthorized' };
  }

  const parseResult = formSchema.safeParse(data);
  if (!parseResult.success) {
    return { success: false, error: 'Invalid data provided.' };
  }
  
  const { itemType, name, slug, description, ...rest } = parseResult.data;

  try {
    if (itemType === 'service') {
        const newService: Omit<Service, 'id' | 'samples' | 'isFeatured' | 'topRated' | 'rating'> = {
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
            description,
            category: rest.category as any || 'invitation-cards',
            price: rest.price || 0,
            priceType: rest.priceType || 'fixed',
            inclusions: rest.inclusions?.map(i => i.value).filter(Boolean) || [],
            deliveryTime: rest.deliveryTime || 'N/A',
        };
        // Use setDoc with a specific ID (slug) to make it queryable and have clean URLs
        await setDoc(doc(db, 'services', newService.slug), newService);
    } else { // package
        const newPackage: Omit<Package, 'id' | 'isBestValue'> = {
            name,
            description,
            price: rest.priceString || '₹0',
            features: rest.features?.map(f => f.value).filter(Boolean) || [],
        };
         // Use setDoc with a specific ID (slug)
        const packageSlug = name.toLowerCase().replace(/\s+/g, '-');
        await setDoc(doc(db, 'comboPackages', packageSlug), newPackage);
    }

    revalidatePath('/admin/services');
    return { success: true };
  } catch (error: any) {
    console.error("Error adding document: ", error);
    return { success: false, error: error.message };
  }
}

