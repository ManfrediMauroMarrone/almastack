import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'your-secure-password-here';

export async function POST(request) {
    try {
        const { password } = await request.json();

        if (password === ADMIN_PASSWORD) {
            // Generate session token
            const token = crypto.randomBytes(32).toString('hex');

            // Set cookie (in production, store this in a database)
            cookies().set('admin_session', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}