
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { initializeAdminApp } from '@/firebase/admin';

export const runtime = 'nodejs';

/**
 * Exchanges a Firebase ID token for a session cookie.
 * This is used to create a secure, server-side session for the user,
 * which is essential for accessing protected server resources.
 */
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const admin = initializeAdminApp();
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    cookies().set('__session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Session Login Error:', error);
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 401 });
  }
}
