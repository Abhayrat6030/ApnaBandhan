
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { initializeAdminApp } from "@/firebase/admin";

export async function DELETE(req: NextRequest) {
    // The middleware has already verified that this request is from an authenticated admin.
    // We can proceed with the deletion logic.
    try {
        // Ensure admin app is initialized, as this route can be accessed directly.
        initializeAdminApp();

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
        // The error might not have a `code` property if it's not a Firebase error
        if (error.code === 'auth/user-not-found') {
            message = "User not found in Firebase Authentication. It might have been already deleted.";
        } else if (error.message) {
            message = error.message;
        }
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
