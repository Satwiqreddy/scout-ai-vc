'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    ArrowUpRight,
    Zap,
    Users,
    Building2,
    Calendar,
    Newspaper,
    TrendingUp,
    RefreshCw,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface PulseItem {
    id: string;
    companyName: string;
    title: string;
    description: string;
    type: 'funding' | 'product' | 'hiring' | 'strategic';
    date: string;
    sentiment: 'positive' | 'neutral';
}

export default function PulsePage() {
    const [items, setItems] = useState<PulseItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchPulse();
    }, []);

    const fetchPulse = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/pulse');
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'funding': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'product': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'hiring': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'strategic': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'funding': return <Zap size={14} />;
            case 'product': return <TrendingUp size={14} />;
            case 'hiring': return <Users size={14} />;
            case 'strategic': return <Building2 size={14} />;
            default: return <Newspaper size={14} />;
        }
    };

    const filteredItems = items.filter(item =>
        item.companyName.toLowerCase().includes(search.toLowerCase()) ||
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary shadow-sm">
                            <Activity size={22} />
                        </div>
                        <h1 className="text-3xl font-black text-text-bright tracking-tight">Portfolio Pulse</h1>
                    </div>
                    <p className="text-text-muted text-sm font-medium">Real-time market signals and intelligence for your stored deals.</p>
                </div>

                <button
                    onClick={fetchPulse}
                    disabled={isLoading}
                    className="p-3 rounded-2xl bg-surface-muted border border-surface-border text-text-muted hover:text-brand-secondary hover:border-brand-secondary/30 transition-all disabled:opacity-50 group"
                >
                    <RefreshCw size={20} className={cn(isLoading && "animate-spin")} />
                </button>
            </header>

            {/* Filters & Search */}
            <div className="flex items-center gap-4 p-2 bg-surface-muted/50 rounded-3xl border border-surface-border">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Search entities or signals..."
                        className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none font-medium placeholder:text-text-muted/60 text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Feed */}
            <div className="space-y-6">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="animate-pulse flex gap-6 p-8 bg-surface-muted/20 border border-surface-border rounded-[2.5rem]">
                            <div className="w-14 h-14 bg-surface-muted rounded-2xl shrink-0" />
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-surface-muted rounded w-1/4" />
                                <div className="h-6 bg-surface-muted rounded w-3/4" />
                                <div className="h-4 bg-surface-muted rounded w-full" />
                            </div>
                        </div>
                    ))
                ) : filteredItems.length > 0 ? (
                    filteredItems.map((item, i) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={item.id}
                            className="group flex flex-col md:flex-row gap-6 p-8 bg-surface-bg border border-surface-border rounded-[2.5rem] hover:shadow-2xl hover:border-brand-secondary/30 transition-all relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between md:justify-start gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-surface-muted flex items-center justify-center font-black text-xl text-text-muted group-hover:bg-brand-secondary/5 group-hover:text-brand-secondary transition-colors border border-surface-border">
                                    {item.companyName[0]}
                                </div>
                                <div className="md:hidden">
                                    <div className={cn("px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5", getTypeStyles(item.type))}>
                                        {getTypeIcon(item.type)}
                                        {item.type}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 text-left">
                                <div className="hidden md:flex items-center gap-3 mb-3">
                                    <span className="text-xs font-black text-brand-secondary uppercase tracking-widest">{item.companyName}</span>
                                    <div className="w-1 h-1 rounded-full bg-surface-border" />
                                    <div className={cn("px-2.5 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5", getTypeStyles(item.type))}>
                                        {getTypeIcon(item.type)}
                                        {item.type}
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-text-bright mb-2 tracking-tight group-hover:text-brand-secondary transition-colors leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-text-muted font-medium leading-relaxed mb-4">
                                    {item.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-surface-border/50">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-bold text-text-muted/60 uppercase tracking-widest flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        {item.sentiment === 'positive' && (
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                                <TrendingUp size={12} />
                                                High Signal
                                            </span>
                                        )}
                                    </div>
                                    <button className="flex items-center gap-1.5 text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-brand-secondary transition-colors">
                                        View Details
                                        <ArrowUpRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="py-32 text-center opacity-30">
                        <Activity size={48} className="mx-auto mb-6" />
                        <h3 className="text-2xl font-black">No signals detected</h3>
                        <p className="font-medium mt-2">Try adding more companies to your pipeline.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
