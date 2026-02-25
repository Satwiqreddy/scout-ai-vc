'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileBarChart,
    Download,
    ChevronRight,
    Printer,
    Plus,
    Building2,
    Calendar,
    Target,
    Users,
    Zap,
    ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Company {
    _id: string;
    name: string;
    description: string;
    industry: string;
    stage: string;
    dealStatus: string;
    deckAnalysis?: {
        tam: string;
        team: string;
        traction: string;
        summary: string;
    };
}

export default function ReportingPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const res = await fetch('/api/companies');
            if (res.ok) {
                const data = await res.json();
                setCompanies(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (selectedCompany) {
        return (
            <div className="p-10 max-w-4xl mx-auto space-y-10 pb-20">
                <button
                    onClick={() => setSelectedCompany(null)}
                    className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors font-black text-xs uppercase tracking-widest mb-6"
                >
                    <ArrowLeft size={14} />
                    Back to Selection
                </button>

                {/* Report Preview */}
                <div id="one-pager" className="bg-white text-zinc-900 p-12 rounded-[2.5rem] shadow-2xl border border-zinc-200 min-h-[1100px] flex flex-col text-left print:shadow-none print:border-none">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">Venture Intelligence Report</p>
                            <h1 className="text-5xl font-black tracking-tighter text-zinc-900 mb-4">{selectedCompany.name}</h1>
                            <div className="flex gap-4">
                                <span className="px-3 py-1 bg-zinc-100 rounded-lg text-[9px] font-black uppercase tracking-widest border border-zinc-200">{selectedCompany.stage}</span>
                                <span className="px-3 py-1 bg-zinc-100 rounded-lg text-[9px] font-black uppercase tracking-widest border border-zinc-200">{selectedCompany.industry}</span>
                            </div>
                        </div>
                        <div className="w-20 h-20 rounded-2xl bg-zinc-900 flex items-center justify-center text-white text-3xl font-black">
                            {selectedCompany.name[0]}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                        <section className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest border-b border-zinc-200 pb-2 text-zinc-500">The Problem & Solution</h3>
                            <p className="text-lg font-medium leading-relaxed text-zinc-700">{selectedCompany.description}</p>
                        </section>
                        <section className="space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest border-b border-zinc-200 pb-2 text-zinc-500">Pipeline Status</h3>
                            <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm font-bold">Deal Stage:</span>
                                    <span className="text-sm font-black text-brand-secondary">{selectedCompany.dealStatus}</span>
                                </div>
                                <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-zinc-900 transition-all duration-700"
                                        style={{ width: `${(['Sourcing', 'Qualified', 'Due Diligence', 'Investment'].indexOf(selectedCompany.dealStatus) + 1) * 25}%` }}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-12 mb-12 flex-1">
                        <section className="space-y-6">
                            <h3 className="text-xs font-black uppercase tracking-widest border-b border-zinc-200 pb-2 text-zinc-500">Venture Intelligence Metrics</h3>
                            {selectedCompany.deckAnalysis ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-zinc-900 font-black text-[10px] uppercase">
                                            <Target size={14} className="text-zinc-400" />
                                            Market (TAM)
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed text-zinc-600">{selectedCompany.deckAnalysis.tam}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-zinc-900 font-black text-[10px] uppercase">
                                            <Users size={14} className="text-zinc-400" />
                                            The Team
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed text-zinc-600">{selectedCompany.deckAnalysis.team}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-zinc-900 font-black text-[10px] uppercase">
                                            <Zap size={14} className="text-zinc-400" />
                                            Momentum
                                        </div>
                                        <p className="text-sm font-medium leading-relaxed text-zinc-600">{selectedCompany.deckAnalysis.traction}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-10 border-2 border-dashed border-zinc-200 rounded-3xl text-center italic text-zinc-400 text-sm">
                                    Full Deck Intelligence not yet generated.
                                </div>
                            )}
                        </section>

                        {selectedCompany.deckAnalysis && (
                            <section className="p-10 bg-zinc-900 rounded-3xl text-white">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Investment Recommendation</h3>
                                <p className="text-2xl font-black leading-tight tracking-tight uppercase italic">{selectedCompany.deckAnalysis.summary}</p>
                            </section>
                        )}
                    </div>

                    <div className="pt-12 border-t border-zinc-200 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-400">
                        <span>VC Scout Intelligence © {new Date().getFullYear()}</span>
                        <span>Generated on {new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-10">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-8 py-4 bg-surface-bg border border-surface-border rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-surface-muted transition-all"
                    >
                        <Printer size={18} />
                        Save as PDF
                    </button>
                    <button className="flex items-center gap-2 px-8 py-4 bg-brand-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-secondary/20 hover:scale-105 transition-all">
                        <Download size={18} />
                        Export Raw Data
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-10 pb-20">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shadow-sm">
                        <FileBarChart size={22} />
                    </div>
                    <h1 className="text-3xl font-black text-text-bright tracking-tight">LP Reporting</h1>
                </div>
                <p className="text-text-muted text-sm font-medium">Generate institutional-grade investment one-pagers for your Limited Partners.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="animate-pulse h-48 bg-surface-muted/20 border border-surface-border rounded-3xl" />
                    ))
                ) : companies.length > 0 ? (
                    companies.map(company => (
                        <motion.div
                            key={company._id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedCompany(company)}
                            className="p-6 bg-surface-bg border border-surface-border rounded-3xl text-left cursor-pointer group hover:border-brand-secondary/30 shadow-sm hover:shadow-xl transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-surface-muted flex items-center justify-center font-black group-hover:bg-brand-secondary/5 group-hover:text-brand-secondary transition-colors">
                                    {company.name[0]}
                                </div>
                                <div className="text-[10px] font-black text-text-muted uppercase tracking-widest">{company.stage}</div>
                            </div>
                            <h3 className="text-lg font-black text-text-bright mb-1 group-hover:text-brand-secondary transition-colors">{company.name}</h3>
                            <p className="text-[11px] text-text-muted font-medium mb-6 uppercase tracking-wider">{company.industry}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-surface-border/50">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">Ready to present</span>
                                <ChevronRight size={16} className="text-text-muted group-hover:text-brand-secondary transition-colors" />
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center opacity-30">
                        <FileBarChart size={48} className="mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-text-muted">No Deals to Report</h3>
                        <p className="font-medium mt-2">Add entities to your sourcing engine to begin generating reports.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
