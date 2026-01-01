
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { initializeAdminApp } from '@/firebase/admin';

export const runtime = 'nodejs';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export async function GET(request: NextRequest) {
  try {
    initializeAdminApp();
    const sessionCookie = cookies().get('__session')?.value || '';

    if (!sessionCookie) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    const isAdmin = decodedClaims.email === ADMIN_EMAIL;
    return NextResponse.json({ isAdmin });
  } catch (error) {
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }
}
