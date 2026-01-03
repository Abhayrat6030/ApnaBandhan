
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Clears the session cookie, effectively logging the user out from the server-side session.
 */
export async function POST(request: NextRequest) {
  try {
    cookies().delete('__session');
    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('Sign Out Error:', error);
    return NextResponse.json({ error: 'Failed to sign out.' }, { status: 500 });
  }
}
