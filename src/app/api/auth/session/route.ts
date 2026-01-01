import { NextResponse } from "next/server";
import admin from "@/firebase/admin";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
        console.log("SESSION FAIL: No ID token provided.");
        throw new Error("No token provided");
    }

    // Optional: Log environment variables for debugging purposes
    console.log("ENV CHECK", {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    });

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
      maxAge: expiresIn,
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
