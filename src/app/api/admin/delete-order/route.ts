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
        return NextResponse.json({ error: "Server configuration error." }, { status: 503 });
    }

    try {
        const sessionCookie = cookies().get("__session")?.value;
        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized: No session cookie." }, { status: 401 });
        }

        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        if (decodedClaims.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Forbidden: You do not have permission." }, { status: 403 });
        }

        const { orderId } = await req.json();
        if (!orderId) {
            return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
        }

        const firestore = admin.firestore();
        await firestore.collection('orders').doc(orderId).delete();

        return NextResponse.json({ success: true, message: `Order ${orderId} deleted successfully.` });

    } catch (error: any) {
        console.error("Error deleting order:", error);
        
        if (error.code === 'auth/session-cookie-expired' || error.code === 'auth/invalid-session-cookie') {
             return NextResponse.json({ error: "Unauthorized: Invalid or expired session." }, { status: 401 });
        }
        
        return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
    }
}
