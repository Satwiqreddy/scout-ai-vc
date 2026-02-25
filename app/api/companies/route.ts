import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Company from '@/lib/models/Company';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const companies = await Company.find({ userEmail: session.email }).sort({ updatedAt: -1 });
        return NextResponse.json(companies);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const company = await Company.create({
            ...body,
            userEmail: session.email
        });

        return NextResponse.json(company, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
