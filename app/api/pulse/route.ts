import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from '@/lib/db';
import Company from '@/lib/models/Company';
import { getSession } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function GET() {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch all companies for the user to generate "news"
        const companies = await Company.find({ userEmail: session.email });

        if (companies.length === 0) {
            return NextResponse.json([]);
        }

        const companyNames = companies.map(c => c.name).join(', ');

        const prompt = `
            Act as a VC Intelligence Scout. Generate 5 realistic, high-signal "Recent News" items for the following startups: ${companyNames}.
            
            Focus on:
            - Recent funding rounds
            - Key hires (ex-Google, ex-OpenAI)
            - Product launches or pivots
            - Strategic partnerships
            - Market expansions
            
            Return the result as a structured JSON array of objects with:
            - id: string
            - companyName: string
            - title: string
            - description: string
            - type: 'funding' | 'product' | 'hiring' | 'strategic'
            - date: ISO date string
            - sentiment: 'positive' | 'neutral'
            
            Output ONLY valid JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const cleanedJson = text.replace(/```json|```/g, "").trim();
        const pulseItems = JSON.parse(cleanedJson);

        return NextResponse.json(pulseItems);
    } catch (error: any) {
        console.error('Pulse API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
