
import { NextRequest, NextResponse } from 'next/server';
import { submitOrder } from '@/app/order/actions';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // The date will be a string here, like "2024-12-04T18:30:00.000Z"
        const result = await submitOrder(body);
        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json(result, { status: 400 });
        }
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, message: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
