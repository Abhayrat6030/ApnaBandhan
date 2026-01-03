
import { NextRequest, NextResponse } from "next/server";
import { initializeAdminApp } from "@/firebase/admin";
import { cookies } from "next/headers";

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export async function DELETE(req: NextRequest) {
    let admin;
    try {
        admin = initializeAdminApp();
    } catch (e: any) {
        console.error("Firebase Admin initialization failed:", e.message);
        return NextResponse.json({ error: "Server configuration error: Could not initialize Firebase Admin." }, { status: 503 });
    }

    try {
        const sessionCookie = cookies().get("__session")?.value;
        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized: No session cookie." }, { status: 401 });
        }

        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        if (decodedClaims.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Forbidden: You do not have permission for this action." }, { status: 403 });
        }

        const { uid } = await req.json();
        if (!uid) {
            return NextResponse.json({ error: "User ID is required." }, { status: 400 });
        }

        // Perform deletions
        await admin.auth().deleteUser(uid);
        const firestore = admin.firestore();
        await firestore.collection('users').doc(uid).delete();

        return NextResponse.json({ success: true, message: `User ${uid} deleted successfully.` });

    } catch (error: any) {
        console.error("Error deleting user:", error);
        
        if (error.code === 'auth/session-cookie-expired' || error.code === 'auth/invalid-session-cookie') {
             return NextResponse.json({ error: "Unauthorized: Invalid or expired session." }, { status: 401 });
        }
        
        return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
    }
}
