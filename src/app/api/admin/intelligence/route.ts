'use server';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    // This is a dummy response because Genkit has been removed.
    // The admin intelligence feature is temporarily disabled.
    return NextResponse.json({ 
        reply: "I'm sorry, the Admin Intelligence feature is temporarily disabled while we upgrade our systems. Please check back later." 
    });
}
