
import { NextResponse, type NextRequest } from "next/server";
import admin from "firebase-admin";
import { cookies } from "next/headers";
import { initializeAdminApp } from "@/firebase/admin";

// Ensure the runtime is Node.js
export const runtime = 'nodejs';

// Initialize admin app safely
initializeAdminApp();

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken } = body;
    
    if (!idToken) {
        return NextResponse.json({ error: "ID token is required." }, { status: 400 });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Crucially, only create a session for the designated admin user.
    if (decodedToken.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized: Not an admin user." }, { status: 403 });
    }
    
    // Set session expiration. 5 days in this case.
    const expiresIn = 60 * 60 * 24 * 5 * 1000; 
    
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Set the cookie on the response.
    cookies().set("__session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true, message: "Session created successfully." });

  } catch (error: any) {
    console.error("SESSION CREATION FAILED:", error);
    return NextResponse.json({ error: error.message || "Session creation failed" }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionCookieName = '__session';
    const sessionCookie = cookies().get(sessionCookieName);

    if (sessionCookie) {
      // Clear the cookie by setting its max-age to 0.
      cookies().set(sessionCookieName, '', { maxAge: 0 });
    }

    return NextResponse.json({ success: true, message: "Session deleted successfully." });
  } catch (error: any) {
    console.error("SESSION DELETION FAILED:", error);
    return NextResponse.json({ error: "Session deletion failed" }, { status: 500 });
  }
}
