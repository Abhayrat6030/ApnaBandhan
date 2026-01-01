
import 'dotenv/config';
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";
import { cookies } from "next/headers";

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

// Helper function to initialize the admin app safely
const initializeAdminApp = () => {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    const missingVars = Object.entries(serviceAccount)
        .filter(([, value]) => !value)
        .map(([key]) => key)
        .join(', ');

    if (missingVars) {
        throw new Error(`Firebase admin initialization failed: Missing environment variables: ${missingVars}`);
    }

    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
};


export async function DELETE(req: NextRequest) {
    try {
        const sessionCookie = cookies().get("__session")?.value || "";
        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized: No session cookie." }, { status: 401 });
        }
        
        initializeAdminApp();

        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);

        if (decodedClaims.email !== ADMIN_EMAIL) {
             return NextResponse.json({ error: "Unauthorized: Not an admin." }, { status: 403 });
        }

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
            message = "User not found in Firebase Authentication.";
        } else if (error.message) {
            message = error.message;
        }
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
