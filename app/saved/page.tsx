'use client';

import React, { useState, useEffect } from 'react';
import {
    Bookmark,
    Search,
    Clock,
    ArrowRight,
    Trash2,
    Bell,
    Play,
    Filter,
    TrendingUp,
    Command,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorageItem, setStorageItem } from '@/lib/storage';

interface SavedSearch {
    id: string;
    query: string;
    date: string;
    results: number;
    alerts: boolean;
}

export default function SavedSearchesPage() {
    const [searches, setSearches] = useState<SavedSearch[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const initialSearches = [
            { id: 's1', query: '"GenAI" + Sector: AI + Stage: Seed', date: '2024-03-22', results: 12, alerts: true },
            { id: 's2', query: 'Location: Paris + Fintech', date: '2024-03-18', results: 5, alerts: false },
            { id: 's3', query: 'Keywords: "Infrastructure", "Developer Tools"', date: '2024-03-10', results: 28, alerts: true }
        ];
        setSearches(getStorageItem('vc_searches', initialSearches));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            setStorageItem('vc_searches', searches);
        }
    }, [searches, isLoaded]);

    const deleteSearch = (id: string) => {
        setSearches(searches.filter(s => s.id !== id));
    };

    const toggleAlerts = (id: string) => {
        setSearches(searches.map(s => s.id === id ? { ...s, alerts: !s.alerts } : s));
    };

    if (!isLoaded) return null;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-brand-secondary font-bold text-xs uppercase tracking-[0.2em] mb-2">
                        <Command className="w-3.5 h-3.5" />
                        Query Automation
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-text-bright">Saved Searches</h1>
                    <p className="text-text-muted font-medium">Automate your sourcing with persistent search queries.</p>
                </div>
            </motion.div>

            <div className="space-y-6">
                <AnimatePresence>
                    {searches.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: i * 0.1 }}
                            className="premium-card p-8 group overflow-hidden relative"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shadow-lg shadow-brand-secondary/5 group-hover:scale-110 transition-transform">
                                            <Search className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-black text-2xl tracking-tight leading-none truncate max-w-xl text-left">{item.query}</h3>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-8 text-xs font-black text-text-muted uppercase tracking-widest pl-16">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Last run {item.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Filter className="w-4 h-4" />
                                            {item.results} Potential Targets
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pl-16 md:pl-0">
                                    <button
                                        onClick={() => toggleAlerts(item.id)}
                                        className={cn(
                                            "p-3 rounded-2xl border border-surface-border transition-all active:scale-95",
                                            item.alerts
                                                ? "text-brand-secondary bg-brand-secondary/5 border-brand-secondary/20 shadow-lg shadow-brand-secondary/5"
                                                : "text-text-muted hover:bg-surface-muted"
                                        )}
                                        title={item.alerts ? "Auto-Alerts: Enabled" : "Enable Alerts"}
                                    >
                                        <Bell className={cn("w-5 h-5", item.alerts && "fill-current")} />
                                    </button>
                                    <button className="flex items-center gap-3 px-8 py-3.5 bg-brand-primary text-white dark:bg-foreground dark:text-background rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 shadow-xl shadow-brand-primary/10 transition-all active:scale-95">
                                        <Play className="w-4 h-4 fill-current" />
                                        Run Search
                                    </button>
                                    <button
                                        onClick={() => deleteSearch(item.id)}
                                        className="p-3 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {searches.length === 0 && (
                    <div className="py-24 text-center border-2 border-dashed border-surface-border rounded-[3rem] bg-surface-muted/10">
                        <Bookmark className="w-16 h-16 text-text-muted/10 mx-auto mb-6" />
                        <h3 className="font-black text-2xl">No Active Queries</h3>
                        <p className="text-text-muted font-medium mt-2">Save a search from Discovery to automate your scouting.</p>
                    </div>
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-10 bg-gradient-to-br from-brand-primary to-slate-900 text-white dark:from-white dark:to-slate-200 dark:text-black rounded-[3rem] relative overflow-hidden shadow-2xl"
            >
                <div className="relative z-10 max-w-2xl space-y-4">
                    <div className="flex items-center gap-2 text-brand-secondary font-black text-xs uppercase tracking-[0.2em]">
                        <Sparkles className="w-4 h-4 fill-current" />
                        Enterprise Upgrade Available
                    </div>
                    <h2 className="text-4xl font-black tracking-tight leading-tight text-left">Advanced Automation Pipeline</h2>
                    <p className="text-lg opacity-70 leading-relaxed font-medium text-left">
                        Integrate your saved searches directly with Slack and CRM systems. Get instant notifications when a high-signal entity matches your investment thesis.
                    </p>
                    <div className="pt-6 flex justify-start">
                        <button className="px-10 py-4 bg-brand-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-brand-secondary/40">
                            Upgrade to Premium →
                        </button>
                    </div>
                </div>
                <TrendingUp className="absolute -bottom-12 -right-12 w-80 h-80 text-white/5 dark:text-black/5 -rotate-12" />
                <Orbit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] text-white/[0.02] dark:text-black/[0.02] pointer-events-none" />
            </motion.div>
        </div>
    );
}

function Orbit({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </svg>
    );
}
