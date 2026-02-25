import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from '@/lib/db';
import Company from '@/lib/models/Company';
import { getSession } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { companyId, websiteUrl, deckText } = await req.json();

        if (!companyId) {
            return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
        }

        const prompt = `
            Act as a Venture Capital Managing Partner. Analyze the following information about a startup and extract key intelligence.
            
            Website/Context: ${websiteUrl || 'Not provided'}
            Deck Data: ${deckText || 'Not provided'}

            Please provide a structured analysis in JSON format with exactly these fields:
            - tam: A concise summary of the Total Addressable Market size and growth.
            - team: An assessment of the founding team's expertise and "founder-market fit".
            - traction: A summary of current momentum, revenue, or user growth.
            - summary: A 2-sentence investment thesis (why invest or why wait).

            Output ONLY valid JSON.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean the JSON output (sometimes AI wraps in markdown blocks)
        const cleanedJson = text.replace(/```json|```/g, "").trim();
        const analysis = JSON.parse(cleanedJson);

        // Save to database
        const updatedCompany = await Company.findOneAndUpdate(
            { _id: companyId, userEmail: session.email },
            {
                $set: {
                    deckAnalysis: {
                        ...analysis,
                        lastAnalyzed: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!updatedCompany) {
            return NextResponse.json({ error: 'Company not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json(analysis);
    } catch (error: any) {
        console.error('Deck Analysis Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
