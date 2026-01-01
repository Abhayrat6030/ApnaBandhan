
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { cookies } from "next/headers";
import { initializeAdminApp } from "@/firebase/admin";


export async function POST(req: Request) {
  try {
    initializeAdminApp();

    const { idToken } = await req.json();
    if (!idToken) {
        return NextResponse.json({ error: "ID token is required." }, { status: 400 });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    
    // The middleware will handle the non-admin case, but this is an extra layer of security.
    if (decoded.email !== "abhayrat603@gmail.com") {
      return NextResponse.json({ error: "Unauthorized: Not an admin." }, { status: 403 });
    }
    
    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
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
