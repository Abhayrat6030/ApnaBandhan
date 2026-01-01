
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { cookies } from "next/headers";
import { initializeAdminApp } from "@/firebase/admin";

// Ensure the runtime is Node.js
export const runtime = 'nodejs';

// Initialize admin app safely
initializeAdminApp();

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
        return NextResponse.json({ error: "ID token is required." }, { status: 400 });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    
    if (decoded.email !== "abhayrat603@gmail.com") {
      return NextResponse.json({ error: "Unauthorized: Not an admin." }, { status: 403 });
    }
    
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    cookies().set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("SESSION CREATION FAIL:", e);
    return NextResponse.json({ error: e.message || "Session creation failed" }, { status: 401 });
  }
}

export async function DELETE() {
  try {
    cookies().delete('__session');
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("SESSION DELETION FAIL:", e);
    return NextResponse.json({ error: "Session deletion failed" }, { status: 500 });
  }
}
