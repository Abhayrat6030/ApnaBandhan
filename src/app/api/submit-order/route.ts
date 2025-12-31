
import { NextRequest, NextResponse } from 'next/server';
import { submitOrder } from '@/app/order/actions';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = await submitOrder(body);
        if (result.success) {
            return NextResponse.json(result);
        } else {
            return NextResponse.json(result, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
