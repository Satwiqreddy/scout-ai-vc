export interface Company {
    id: string;
    name: string;
    website: string;
    description: string;
    sector: string;
    stage: 'Stealth' | 'Seed' | 'Series A' | 'Series B' | 'Series C+';
    fundingTotal: string;
    location: string;
    founded: number;
    tags: string[];
    signals: Signal[];
    notes?: string;
    dealStatus?: 'Sourcing' | 'Qualified' | 'Due Diligence' | 'Investment' | 'Passed';
    enrichedData?: EnrichedData;
}

export interface Signal {
    id: string;
    type: 'hiring' | 'funding' | 'product' | 'social';
    date: string;
    title: string;
    description: string;
}

export interface EnrichedData {
    summary: string;
    bulletPoints: string[];
    keywords: string[];
    derivedSignals: string[];
    sources: { url: string; timestamp: string }[];
}

export const mockCompanies: Company[] = [
    {
        id: '1',
        name: 'OpenAI',
        website: 'https://openai.com',
        description: 'AI research and deployment company.',
        sector: 'Artificial Intelligence',
        stage: 'Series C+',
        fundingTotal: '$13B+',
        location: 'San Francisco, CA',
        founded: 2015,
        tags: ['Generative AI', 'LLM', 'Enterprise'],
        signals: [
            { id: 's1', type: 'funding', date: '2024-02-15', title: 'New Funding Round', description: 'Raised undisclosed amount from institutional investors.' },
            { id: 's2', type: 'hiring', date: '2024-01-10', title: 'Aggressive Hiring', description: 'Opened 50+ new roles in robotics and safety layers.' }
        ]
    },
    {
        id: '2',
        name: 'Stripe',
        website: 'https://stripe.com',
        description: 'Financial infrastructure for the internet.',
        sector: 'Fintech',
        stage: 'Series C+',
        fundingTotal: '$9.4B',
        location: 'South San Francisco, CA',
        founded: 2010,
        tags: ['Payments', 'API', 'Infrastructure'],
        signals: [
            { id: 's3', type: 'product', date: '2024-03-01', title: 'Stripe Tax Expansion', description: 'Launched tax automation in 10 new European markets.' }
        ]
    },
    {
        id: '3',
        name: 'Vercel',
        website: 'https://vercel.com',
        description: 'Frontend cloud platform.',
        sector: 'Developer Tools',
        stage: 'Series C+',
        fundingTotal: '$313M',
        location: 'San Francisco, CA',
        founded: 2015,
        tags: ['Next.js', 'Frontend', 'Cloud'],
        signals: []
    },
    {
        id: '4',
        name: 'Perplexity AI',
        website: 'https://perplexity.ai',
        description: 'Conversational search engine.',
        sector: 'Artificial Intelligence',
        stage: 'Series B',
        fundingTotal: '$165M',
        location: 'San Francisco, CA',
        founded: 2022,
        tags: ['Search', 'LLM', 'Consumer AI'],
        signals: [
            { id: 's4', type: 'social', date: '2024-03-12', title: 'Viral Growth', description: 'Reached 10M monthly active users milestone.' }
        ]
    },
    {
        id: '5',
        name: 'Mistral AI',
        website: 'https://mistral.ai',
        description: 'Frontier AI models developer.',
        sector: 'Artificial Intelligence',
        stage: 'Series A',
        fundingTotal: '$500M+',
        location: 'Paris, France',
        founded: 2023,
        tags: ['Open Source', 'LLM', 'Europe'],
        signals: []
    },
    {
        id: '6',
        name: 'Databricks',
        website: 'https://databricks.com',
        description: 'Data and AI company.',
        sector: 'SaaS',
        stage: 'Series C+',
        fundingTotal: '$4B+',
        location: 'San Francisco, CA',
        founded: 2013,
        tags: ['Data Lake', 'Spark', 'Enterprise'],
        signals: [
            { id: 's5', type: 'funding', date: '2023-09-14', title: 'Series I Funding', description: 'Raised $500M at a $43B valuation.' }
        ]
    }
];
