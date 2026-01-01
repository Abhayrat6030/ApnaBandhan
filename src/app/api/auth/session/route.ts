import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import admin from '@/firebase/admin';

// Handles session creation (login)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const idToken = body.idToken?.toString();

  if (!idToken) {
    return NextResponse.json({ error: 'ID token is required.' }, { status: 400 });
  }

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
    const options = { name: '__session', value: sessionCookie, maxAge: expiresIn, httpOnly: true, secure: true };
    cookies().set(options);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session cookie creation failed:', error);
    return NextResponse.json({ error: 'Failed to create session.' }, { status: 401 });
  }
}

// Handles session termination (logout)
export async function DELETE() {
  cookies().delete('__session');
  return NextResponse.json({ success: true });
}
