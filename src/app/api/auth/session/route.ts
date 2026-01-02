
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { initializeAdminApp } from "@/firebase/admin";

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export async function POST(req: NextRequest) {
  const admin = initializeAdminApp();
  if (!admin) {
    return NextResponse.json({ error: "Firebase Admin not initialized. Server configuration issue." }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { idToken } = body;
    
    if (!idToken) {
        return NextResponse.json({ error: "ID token is required." }, { status: 400 });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Ensure the user trying to create a session is the admin
    if (decodedToken.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    cookies().set("__session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true, message: "Session created successfully." });

  } catch (error: any) {
    console.error("SESSION CREATION FAILED:", error);
    let errorMessage = "Session creation failed";
    if (error.code === 'auth/id-token-expired') {
        errorMessage = "Login session expired, please try again.";
    } else if (error.message.includes('incorrect "aud" (audience) claim')) {
        errorMessage = "Project configuration mismatch. Please contact support.";
    }
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionCookieName = '__session';
    cookies().delete(sessionCookieName);
    return NextResponse.json({ success: true, message: "Session deleted successfully." });
  } catch (error: any) {
    console.error("SESSION DELETION FAILED:", error);
    return NextResponse.json({ error: "Session deletion failed" }, { status: 500 });
  }
}
