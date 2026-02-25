import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Company from '@/lib/models/Company';
import { getSession } from '@/lib/auth';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const company = await Company.findOne({
            _id: params.id,
            userEmail: session.email
        });

        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        return NextResponse.json(company);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const company = await Company.findOneAndUpdate(
            { _id: params.id, userEmail: session.email },
            { $set: body },
            { new: true }
        );

        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        return NextResponse.json(company);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const company = await Company.findOneAndDelete({
            _id: params.id,
            userEmail: session.email
        });

        if (!company) {
            return NextResponse.json({ error: 'Company not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Company deleted' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
