import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        await connectToDatabase();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        await User.create({
            email,
            password: hashedPassword,
            name,
        });

        return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
    } catch (error: any) {
        console.error('Signup Error:', error);
        return NextResponse.json({
            error: 'Database Connection or Server Error',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
