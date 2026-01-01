
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { initializeAdminApp } from "@/firebase/admin";
import admin from "firebase-admin";

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export async function POST(req: NextRequest) {
  try {
    initializeAdminApp();
    const body = await req.json();
    const { idToken } = body;
    
    if (!idToken) {
        return NextResponse.json({ error: "ID token is required." }, { status: 400 });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
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
    return NextResponse.json({ error: error.message || "Session creation failed" }, { status: 401 });
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
