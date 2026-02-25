import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        await connectToDatabase();

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Create JWT
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-key-123-vc-platform');
        const token = await new jose.SignJWT({
            id: user._id,
            email: user.email,
            name: user.name
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(secret);

        // Create the response
        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });

        // Set cookie
        response.cookies.set('vc_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return response;
    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
