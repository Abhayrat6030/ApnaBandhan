import { cookies } from 'next/headers';
import { auth } from '@/firebase/admin';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export async function verifyAdmin(): Promise<boolean> {
  const sessionCookie = cookies().get('__session')?.value || '';

  if (!sessionCookie) {
    return false;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return decodedClaims.email === ADMIN_EMAIL;
  } catch (error) {
    // We can log the error for debugging, but for security, we just return false.
    console.error('Admin verification failed:', error);
    return false;
  }
}
