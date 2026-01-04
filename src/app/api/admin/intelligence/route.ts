
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { initializeAdminApp } from "@/firebase/admin";

const ADMIN_EMAIL = 'abhayrat603@gmail.com';

export async function POST(req: NextRequest) {
    // Temporarily disable AI functionality to fix build error
    return NextResponse.json({
        reply: "The admin intelligence feature is temporarily disabled while we resolve a configuration issue. Please check back later."
    });
}
