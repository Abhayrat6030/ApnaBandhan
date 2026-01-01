
import 'dotenv/config';
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// The admin app is initialized in middleware.ts, so we can assume it's available here.
// A check is added just in case for safety.
const ensureAdminApp = () => {
    if (admin.apps.length === 0) {
        throw new Error("Firebase admin app is not initialized. This should not happen if middleware is correct.");
    }
};

export async function DELETE(req: NextRequest) {
    // The middleware has already verified that this request is from an authenticated admin.
    // We can proceed with the deletion logic.
    try {
        ensureAdminApp();

        const { uid } = await req.json();
        if (!uid) {
            return NextResponse.json({ error: "User ID is required." }, { status: 400 });
        }

        // 1. Delete from Firebase Authentication
        await admin.auth().deleteUser(uid);
        
        // 2. Delete from Firestore
        const firestore = admin.firestore();
        await firestore.collection('users').doc(uid).delete();

        return NextResponse.json({ success: true, message: `User ${uid} deleted successfully.` });

    } catch (error: any) {
        console.error("Error deleting user:", error);
        let message = "An internal server error occurred.";
        if (error.code === 'auth/user-not-found') {
            message = "User not found in Firebase Authentication.";
        } else if (error.message) {
            message = error.message;
        }
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
