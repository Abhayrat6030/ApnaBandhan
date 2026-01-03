
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { initializeAdminApp } from '@/firebase/admin';

export const runtime = 'nodejs';

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export async function GET(request: NextRequest) {
  try {
    // This will now throw an error if env vars are missing, which is the correct behavior.
    const admin = initializeAdminApp();

    const sessionCookie = cookies().get('__session')?.value || '';

    if (!sessionCookie) {
      return NextResponse.json({ isAdmin: false }, { status: 401, statusText: 'No session cookie' });
    }

    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    const isAdmin = decodedClaims.email === ADMIN_EMAIL;
    
    return NextResponse.json({ isAdmin });

  } catch (error: any) {
    // Log the actual error on the server for debugging
    console.error("Auth verification error:", error.message);
    
    // Return a generic error to the client
    return NextResponse.json({ isAdmin: false, error: 'Authentication failed' }, { status: 401 });
  }
}
