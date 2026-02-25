import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
    name: string;
    logo?: string;
    description: string;
    industry: string;
    stage: string;
    location: string;
    website?: string;
    signals: Array<{
        type: string;
        label: string;
        value: string;
        sentiment: 'positive' | 'neutral' | 'negative';
    }>;
    userEmail: string; // The owner of the lead
    dealStatus: 'Sourcing' | 'Qualified' | 'Due Diligence' | 'Investment' | 'Passed';
    notes: Array<{
        text: string;
        date: Date;
    }>;
    deckAnalysis?: {
        tam: string;
        team: string;
        traction: string;
        summary: string;
        lastAnalyzed: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>({
    name: { type: String, required: true },
    logo: String,
    description: { type: String, required: true },
    industry: { type: String, required: true },
    stage: { type: String, required: true },
    location: { type: String, required: true },
    website: String,
    signals: [{
        type: String,
        label: String,
        value: String,
        sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] }
    }],
    userEmail: { type: String, required: true, index: true },
    dealStatus: {
        type: String,
        enum: ['Sourcing', 'Qualified', 'Due Diligence', 'Investment', 'Passed'],
        default: 'Sourcing',
        index: true
    },
    notes: [{
        text: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }],
    deckAnalysis: {
        tam: String,
        team: String,
        traction: String,
        summary: String,
        lastAnalyzed: Date
    }
}, {
    timestamps: true
});

// Avoid re-compiling the model in development
export default mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
