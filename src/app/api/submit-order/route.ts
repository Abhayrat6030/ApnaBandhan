
import { NextRequest, NextResponse } from 'next/server';
import { submitOrder } from '@/app/order/actions';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        const headersList = headers();
        const authorization = headersList.get('Authorization');
        const idToken = authorization?.split('Bearer ')[1] || null;

        const result = await submitOrder(body, idToken);

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
