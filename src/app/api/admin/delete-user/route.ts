
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { initializeAdminApp } from "@/firebase/admin";
import { cookies } from "next/headers";

// Ensure the runtime is Node.js
export const runtime = 'nodejs';

// Initialize the admin app
initializeAdminApp();

export async function DELETE(req: NextRequest) {
    try {
        // 1. Verify the session cookie before proceeding
        const sessionCookie = cookies().get("__session")?.value;
        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized: No session cookie." }, { status: 401 });
        }

        try {
            await admin.auth().verifySessionCookie(sessionCookie, true);
            // The cookie is valid, and the user is authenticated. We can proceed.
        } catch (error) {
            // The cookie is invalid (expired, revoked, etc.)
            return NextResponse.json({ error: "Unauthorized: Invalid session." }, { status: 403 });
        }

        // 2. Proceed with the deletion logic
        const { uid } = await req.json();
        if (!uid) {
            return NextResponse.json({ error: "User ID is required." }, { status: 400 });
        }

        // Delete from Firebase Authentication
        await admin.auth().deleteUser(uid);
        
        // Delete from Firestore
        const firestore = admin.firestore();
        await firestore.collection('users').doc(uid).delete();

        return NextResponse.json({ success: true, message: `User ${uid} deleted successfully.` });

    } catch (error: any) {
        console.error("Error deleting user:", error);
        let message = "An internal server error occurred.";
        if (error.code === 'auth/user-not-found') {
            message = "User not found in Firebase Authentication. It might have been already deleted.";
        } else if (error.message) {
            message = error.message;
        }
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
