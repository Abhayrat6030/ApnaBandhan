import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { initializeAdminApp } from "@/firebase/admin";
import { cookies } from "next/headers";
import 'dotenv/config';

// Initialize admin app safely
initializeAdminApp();

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
        console.log("SESSION FAIL: No ID token provided.");
        throw new Error("No token provided");
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    
    console.log("DECODED EMAIL:", decoded.email);

    if (decoded.email !== "abhayrat603@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    cookies().set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: "lax",
      path: "/",
      maxAge: expiresIn / 1000, // maxAge is in seconds
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("SESSION FAIL:", e);
    // Return a more specific error message if available
    return NextResponse.json({ error: e.message || "Session creation failed" }, { status: 401 });
  }
}

// Handles session termination (logout)
export async function DELETE() {
  cookies().delete('__session');
  return NextResponse.json({ success: true });
}
