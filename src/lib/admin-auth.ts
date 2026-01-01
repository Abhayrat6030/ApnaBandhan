import { cookies } from 'next/headers';
import admin from '@/firebase/admin';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export async function verifyAdmin(): Promise<boolean> {
  const sessionCookie = cookies().get('__session')?.value || '';

  if (!sessionCookie) {
    return false;
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims.email === ADMIN_EMAIL;
  } catch (error) {
    console.error('Admin verification failed:', error);
    return false;
  }
}
