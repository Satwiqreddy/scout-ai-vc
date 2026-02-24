'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Building2,
    Globe,
    MapPin,
    Calendar,
    DollarSign,
    ArrowLeft,
    Zap,
    Clock,
    ExternalLink,
    Plus,
    Loader2,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    Sparkles,
    Command,
    ChevronRight,
    Save,
    Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockCompanies, Company } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorageItem, setStorageItem } from '@/lib/storage';

export default function CompanyProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [company, setCompany] = useState<Company | null>(null);
    const [isEnriching, setIsEnriching] = useState(false);
    const [notes, setNotes] = useState('');
    const [activeTab, setActiveTab] = useState<'overview' | 'signals' | 'notes'>('overview');
    const [showSaveMenu, setShowSaveMenu] = useState(false);
    const [lists, setLists] = useState<any[]>([]);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const found = mockCompanies.find(c => c.id === params.id);
        if (found) {
            setCompany(found);
            // Load persistent notes
            const savedNotes = getStorageItem(`vc_notes_${params.id}`, found.notes || '');
            setNotes(savedNotes);
        }
        setLists(getStorageItem('vc_lists', []));
    }, [params.id]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveNotes = () => {
        setStorageItem(`vc_notes_${params.id}`, notes);
        showToast("Intelligence notes saved securely.");
    };

    const handleAddToList = (listId: string) => {
        const updatedLists = lists.map(l => {
            if (l.id === listId) {
                if (l.companies.includes(params.id)) return l;
                return { ...l, companies: [...l.companies, params.id], count: l.companies.length + 1 };
            }
            return l;
        });
        setLists(updatedLists);
        setStorageItem('vc_lists', updatedLists);
        setShowSaveMenu(false);
        showToast(`Added to ${lists.find(l => l.id === listId)?.name}`);
    };

    const handleEnrich = async () => {
        if (!company) return;
        setIsEnriching(true);

        try {
            const response = await fetch('/api/enrich', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ website: company.website, companyId: company.id }),
            });

            if (!response.ok) throw new Error('Enrichment failed');

            const data = await response.json();
            setCompany(prev => prev ? { ...prev, enrichedData: data } : null);
            showToast("Deep enrichment complete.");
        } catch (error) {
            console.error(error);
            // Fallback to mock enrichment
            setTimeout(() => {
                setCompany(prev => prev ? {
                    ...prev,
                    enrichedData: {
                        summary: `${company.name} is a high-growth scale-up in the ${company.sector} domain, currently dominating the ${company.tags[0]} market with proprietary AI models.`,
                        bulletPoints: [
                            "Industry-leading " + company.sector + " architecture",
                            "World-class engineering team from Tier 1 companies",
                            "Hyper-scale infrastructure supporting 1M+ users",
                            "Strategic partnership network across Fortune 500"
                        ],
                        keywords: [...company.tags, "Market Leader", "Innovation", "Disruptive"],
                        derivedSignals: ["Massive hiring push in EMEA", "Recent v3 API release", "Social engagement up 300%"],
                        sources: [{ url: company.website, timestamp: new Date().toISOString() }]
                    }
                } : null);
                showToast("Enrichment complete (simulated).");
            }, 1500);
        } finally {
            setIsEnriching(false);
        }
    };

    if (!company) return null;

    return (
        <div className="min-h-screen bg-surface-muted/30 pb-20">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 bg-zinc-900 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
                    >
                        <CheckCircle2 className="w-5 h-5 text-brand-secondary" />
                        <span className="font-bold text-sm tracking-tight">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top Header Navigation */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-40 glass border-b border-surface-border"
            >
                <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-text-muted hover:text-text-main transition-colors font-black text-xs uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Exit Profile
                    </button>
                    <div className="flex items-center gap-3 relative">
                        <div className="relative">
                            <button
                                onClick={() => setShowSaveMenu(!showSaveMenu)}
                                className="px-5 py-2.5 rounded-2xl bg-surface-bg border border-surface-border text-sm font-black hover:bg-surface-muted transition-all flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Save to Pipeline
                            </button>

                            <AnimatePresence>
                                {showSaveMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-64 bg-surface-bg border border-surface-border rounded-2xl shadow-2xl p-2 z-50"
                                    >
                                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest p-3 border-b border-surface-border mb-1 text-left">Select Pipeline</p>
                                        {lists.length > 0 ? (
                                            lists.map(list => (
                                                <button
                                                    key={list.id}
                                                    onClick={() => handleAddToList(list.id)}
                                                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-surface-muted transition-colors flex items-center justify-between group"
                                                >
                                                    <span className="text-sm font-bold group-hover:text-brand-secondary">{list.name}</span>
                                                    {list.companies.includes(params.id) && <Check className="w-4 h-4 text-brand-secondary" />}
                                                </button>
                                            ))
                                        ) : (
                                            <p className="p-4 text-xs font-medium text-text-muted text-center italic">No lists created yet.</p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button
                            onClick={handleEnrich}
                            disabled={isEnriching}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-2xl font-black text-sm transition-all shadow-lg",
                                isEnriching
                                    ? "bg-surface-muted text-text-muted cursor-not-allowed"
                                    : "bg-brand-secondary text-white hover:scale-[1.02] shadow-brand-secondary/20"
                            )}
                        >
                            {isEnriching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                            {isEnriching ? 'ENRICHING...' : 'ENRICH WITH AI'}
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Hero Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="premium-card p-10 relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                                <div className="w-24 h-24 rounded-3xl bg-surface-muted border border-surface-border flex items-center justify-center text-4xl font-black text-text-muted shadow-inner group-hover:bg-brand-secondary/5 group-hover:text-brand-secondary transition-all">
                                    {company.name[0]}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                                        <h1 className="text-4xl font-black tracking-tight">{company.name}</h1>
                                        <span className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary rounded-lg text-[10px] font-black uppercase tracking-widest self-center md:self-auto">
                                            {company.stage}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-text-muted font-bold">
                                        <a href={company.website} target="_blank" className="flex items-center gap-2 hover:text-brand-secondary transition-colors group/link">
                                            <Globe className="w-4 h-4" />
                                            {company.website.replace('https://', '')}
                                            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                        </a>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {company.location}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-8 border-b border-surface-border mb-10 overflow-x-auto pb-1">
                                {(['overview', 'signals', 'notes'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={cn(
                                            "pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
                                            activeTab === tab ? "text-text-bright" : "text-text-muted hover:text-text-main"
                                        )}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTabUnderline"
                                                className="absolute bottom-0 left-0 right-0 h-1 bg-brand-secondary rounded-full"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {activeTab === 'overview' && (
                                        <div className="space-y-10">
                                            <p className="text-xl leading-relaxed font-medium text-text-main text-left">{company.description}</p>

                                            {company.enrichedData ? (
                                                <div className="space-y-8">
                                                    <div className="p-8 bg-brand-secondary/5 rounded-3xl border border-brand-secondary/10 relative overflow-hidden group">
                                                        <div className="relative z-10 text-left">
                                                            <div className="flex items-center gap-2 mb-4 text-brand-secondary font-black text-[11px] uppercase tracking-widest">
                                                                <Sparkles className="w-4 h-4 fill-current" />
                                                                AI Market Intelligence
                                                            </div>
                                                            <p className="text-xl font-black mb-6 leading-tight">{company.enrichedData.summary}</p>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                                                                {company.enrichedData.bulletPoints.map((point, i) => (
                                                                    <div key={i} className="flex items-start gap-3 text-sm text-text-muted font-bold font-medium leading-relaxed">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-1.5 shrink-0" />
                                                                        {point}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <Zap className="absolute -bottom-8 -right-8 w-40 h-40 text-brand-secondary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                                        <div className="p-6 bg-surface-muted/50 rounded-3xl border border-surface-border">
                                                            <h4 className="text-[10px] font-black mb-4 uppercase tracking-widest text-text-muted">Extracted Signals</h4>
                                                            <div className="space-y-3">
                                                                {company.enrichedData.derivedSignals.map((signal, i) => (
                                                                    <div key={i} className="flex items-center gap-3 text-sm font-bold">
                                                                        <div className="w-8 h-8 rounded-xl bg-surface-bg flex items-center justify-center text-brand-secondary border border-surface-border shadow-sm">
                                                                            <TrendingUp className="w-4 h-4" />
                                                                        </div>
                                                                        {signal}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="p-6 bg-surface-muted/50 rounded-3xl border border-surface-border">
                                                            <h4 className="text-[10px] font-black mb-4 uppercase tracking-widest text-text-muted">Entity Graph Tags</h4>
                                                            <div className="flex flex-wrap gap-2">
                                                                {company.enrichedData.keywords.map((kw, i) => (
                                                                    <span key={i} className="px-3 py-1.5 rounded-xl bg-surface-bg border border-surface-border text-[11px] font-black text-text-muted uppercase tracking-tight hover:border-brand-secondary transition-colors">
                                                                        {kw}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="p-16 text-center border-2 border-dashed border-surface-border rounded-[2.5rem] bg-surface-muted/10">
                                                    <div className="w-20 h-20 bg-surface-bg rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-surface-border shadow-xl shadow-black/[0.02]">
                                                        <Zap className="w-10 h-10 text-text-muted/40" />
                                                    </div>
                                                    <h3 className="font-black text-2xl tracking-tight">Generate Intelligence</h3>
                                                    <p className="text-text-muted mt-2 mb-10 max-w-sm mx-auto font-medium">
                                                        Synthesize real-time data from the company ecosystem to reveal hidden signal.
                                                    </p>
                                                    <button
                                                        onClick={handleEnrich}
                                                        className="px-8 py-3.5 bg-brand-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-brand-secondary/30"
                                                    >
                                                        Run Active Scout
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'signals' && (
                                        <div className="space-y-12 pl-4 text-left">
                                            {company.signals.length > 0 ? (
                                                company.signals.map((signal, i) => (
                                                    <motion.div
                                                        key={signal.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex gap-8 relative"
                                                    >
                                                        <div className="mt-1.5 flex flex-col items-center">
                                                            <div className="w-4 h-4 rounded-full bg-brand-secondary shadow-[0_0_10px_rgba(99,102,241,0.5)] z-10" />
                                                            {i < company.signals.length - 1 && (
                                                                <div className="w-1 h-full bg-gradient-to-b from-brand-secondary to-transparent absolute top-1.5 opacity-20" />
                                                            )}
                                                        </div>
                                                        <div className="pb-4">
                                                            <span className="text-[10px] font-black text-brand-secondary uppercase tracking-[0.2em]">{new Date(signal.date).toLocaleDateString(undefined, { month: 'long', year: 'numeric', day: 'numeric' })}</span>
                                                            <h4 className="text-2xl font-black mt-2 tracking-tight">{signal.title}</h4>
                                                            <p className="text-text-muted mt-2 text-lg font-medium leading-relaxed">{signal.description}</p>
                                                            <div className="mt-4 flex items-center gap-2 text-xs font-black text-text-muted/60 uppercase tracking-widest">
                                                                <Command className="w-3.5 h-3.5" />
                                                                Verified Signal
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="py-20 text-center bg-surface-muted/20 rounded-[2.5rem] border border-dashed border-surface-border">
                                                    <Clock className="w-16 h-16 text-text-muted/10 mx-auto mb-6" />
                                                    <h3 className="font-black text-xl">Timeline Silent</h3>
                                                    <p className="text-text-muted font-medium mt-2">No public signals tracked in the last 180 days.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === 'notes' && (
                                        <div className="space-y-6">
                                            <div className="group premium-card p-1 focus-within:ring-4 focus-within:ring-brand-secondary/10 transition-all">
                                                <textarea
                                                    placeholder="Architect your thesis analysis, competitor deep-dives, or follow-up strategy..."
                                                    className="w-full h-80 p-8 bg-transparent focus:outline-none resize-none text-xl font-medium leading-relaxed"
                                                    value={notes}
                                                    onChange={(e) => setNotes(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => setNotes(company.notes || '')}
                                                    className="px-6 py-2.5 bg-surface-muted border border-surface-border rounded-xl text-sm font-bold text-text-muted hover:bg-surface-border transition-all"
                                                >
                                                    Discard
                                                </button>
                                                <button
                                                    onClick={handleSaveNotes}
                                                    className="px-8 py-3 bg-brand-primary text-white dark:bg-foreground dark:text-background rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 shadow-lg shadow-brand-primary/10 flex items-center gap-2"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    Secure Notes
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Source Transparency */}
                        {company.enrichedData && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-between px-6 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]"
                            >
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Source: {company.enrichedData.sources[0].url}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    Synced {new Date(company.enrichedData.sources[0].timestamp).toLocaleTimeString()}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="premium-card p-8 bg-surface-bg dark:bg-background text-left"
                        >
                            <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mb-8">Entity Essentials</h3>
                            <div className="space-y-8">
                                {[
                                    { label: 'Total Funding', value: company.fundingTotal, icon: DollarSign },
                                    { label: 'Market Stage', value: company.stage, icon: TrendingUp },
                                    { label: 'Founded In', value: company.founded, icon: Calendar },
                                    { label: 'Vertical', value: company.sector, icon: Globe },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center gap-4 group cursor-default">
                                        <div className="w-12 h-12 rounded-2xl bg-surface-muted flex items-center justify-center text-brand-secondary group-hover:bg-brand-secondary group-hover:text-white transition-all shadow-sm">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className="font-black text-lg">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-10 border-t border-surface-border">
                                <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-6 whitespace-nowrap">Internal Taxonomy</h4>
                                <div className="flex flex-wrap gap-2">
                                    {company.tags.map(tag => (
                                        <span key={tag} className="px-3 py-2 rounded-xl bg-surface-muted border border-surface-border text-[10px] font-black text-text-muted uppercase tracking-tight hover:bg-surface-border transition-colors cursor-pointer">
                                            {tag}
                                        </span>
                                    ))}
                                    <button className="px-3 py-2 rounded-xl border border-dashed border-surface-border text-[10px] font-black text-text-muted uppercase tracking-tight hover:border-brand-secondary hover:text-brand-secondary transition-all">
                                        + Taxonomy
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="premium-card p-8 bg-gradient-to-br from-brand-secondary/20 to-brand-primary/10 border-brand-secondary/20 relative overflow-hidden group shadow-2xl shadow-brand-secondary/5 text-left"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-black text-xl tracking-tight">Thesis Fit</h3>
                                    <div className="w-12 h-12 rounded-2xl bg-brand-secondary flex items-center justify-center text-white text-sm font-black shadow-lg shadow-brand-secondary/20">
                                        94%
                                    </div>
                                </div>
                                <p className="text-sm text-text-muted font-bold mb-6 leading-relaxed">
                                    Strong alignment with "GenAI Enterprise" focus. Founder background and product velocity are top-decile indicators.
                                </p>
                                <button className="w-full py-3 bg-white text-black dark:bg-black dark:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-transform">
                                    Full Analysis Report
                                </button>
                            </div>
                            <Sparkles className="absolute -bottom-6 -right-6 w-32 h-32 text-brand-secondary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
