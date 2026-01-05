
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { initializeAdminApp } from "@/firebase/admin";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export async function POST(req: NextRequest) {
    try {
        // --- 1. Authentication and Authorization ---
        const sessionCookie = cookies().get("__session")?.value;
        if (!sessionCookie) {
            return NextResponse.json({ error: "Unauthorized: No session cookie." }, { status: 401 });
        }

        const admin = initializeAdminApp();
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);

        if (decodedClaims.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Forbidden: You do not have permission for this action." }, { status: 403 });
        }

        // --- 2. Request Body and History ---
        const { message, history } = await req.json();
        if (!message) {
             return NextResponse.json({ error: "Message is required." }, { status: 400 });
        }

        // --- 3. System Prompt and Data Fetching ---
        const firestore = admin.firestore();
        const usersSnapshot = await firestore.collection('users').get();
        const ordersSnapshot = await firestore.collection('orders').get();

        const systemPrompt = `You are a helpful admin assistant for an e-commerce website called ApnaBandhan. Your name is "AdminAI".
        You have access to real-time data from the Firestore database.
        When asked a question, use the following data to provide an accurate answer.
        Be concise and helpful. Format your answers clearly, using lists or tables if necessary.

        CURRENT DATA:
        - Total Users: ${usersSnapshot.size}
        - Total Orders: ${ordersSnapshot.size}

        Here is a summary of the last 5 orders (if any):
        ${ordersSnapshot.docs.slice(0, 5).map(doc => {
            const data = doc.data();
            return `- Order ID: ${doc.id}, User: ${data.fullName}, Status: ${data.status}, Payment: ${data.paymentStatus}, Service: ${data.selectedServiceId}`;
        }).join('\n') || 'No recent orders.'}
        
        Here is a summary of the last 5 users (if any):
        ${usersSnapshot.docs.slice(0, 5).map(doc => {
             const data = doc.data();
             return `- User ID: ${doc.id}, Name: ${data.displayName}, Email: ${data.email}, Joined: ${new Date(data.createdAt).toLocaleDateString()}`;
        }).join('\n') || 'No recent users.'}
        `;
        
        const messages = [
            { role: "system", content: systemPrompt },
            ...(history || []),
            { role: "user", content: message },
        ];
        
        // --- 4. Call Groq AI ---
        const chatCompletion = await groq.chat.completions.create({
            messages: messages as any,
            model: "llama3-70b-8192",
        });

        const reply = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

        return NextResponse.json({ reply });

    } catch (error: any) {
        console.error("Admin Intelligence Error:", error);
        if (error.code === 'auth/session-cookie-expired' || error.code === 'auth/invalid-session-cookie') {
             return NextResponse.json({ error: "Unauthorized: Invalid or expired session." }, { status: 401 });
        }
        return NextResponse.json({ error: error.message || "An internal server error occurred." }, { status: 500 });
    }
}
