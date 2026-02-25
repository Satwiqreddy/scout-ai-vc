'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GitBranch,
    MoreVertical,
    Plus,
    Search,
    ChevronRight,
    TrendingUp,
    Zap,
    Building2,
    Calendar,
    Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const STAGES = ['Sourcing', 'Qualified', 'Due Diligence', 'Investment', 'Passed'] as const;
type DealStatus = typeof STAGES[number];

interface Company {
    _id: string;
    name: string;
    description: string;
    industry: string;
    stage: string;
    dealStatus: DealStatus;
    updatedAt: string;
}

export default function PipelinePage() {
    const [companies, setCompanies] = useState<Company[]>([]);
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
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: DealStatus) => {
        try {
            const res = await fetch(`/api/companies/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dealStatus: newStatus })
            });
            if (res.ok) {
                setCompanies(prev => prev.map(c =>
                    c._id === id ? { ...c, dealStatus: newStatus } : c
                ));
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const getColumns = () => {
        return STAGES.map(stage => ({
            id: stage,
            companies: companies.filter(c => c.dealStatus === stage)
        }));
    };

    return (
        <div className="p-8 pb-20">
            {/* Header */}
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                            <GitBranch size={18} />
                        </div>
                        <h1 className="text-2xl font-black text-text-bright tracking-tight">Deal flow Pipeline</h1>
                    </div>
                    <p className="text-text-muted text-sm font-medium">Manage and track your sourcing pipeline across investment stages.</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/companies')}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-secondary text-white rounded-2xl font-black text-sm shadow-lg shadow-brand-secondary/20 hover:scale-105 transition-all"
                    >
                        <Plus size={18} />
                        Add New Deal
                    </button>
                </div>
            </header>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start">
                {getColumns().map(column => (
                    <div key={column.id} className="flex flex-col gap-4 min-w-[280px]">
                        {/* Column Header */}
                        <div className="flex items-center justify-between px-2 mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">{column.id}</span>
                                <div className="px-1.5 py-0.5 rounded-md bg-surface-muted border border-surface-border text-[10px] font-black text-text-muted">
                                    {column.companies.length}
                                </div>
                            </div>
                            <MoreVertical size={14} className="text-text-muted cursor-pointer hover:text-text-high" />
                        </div>

                        {/* Column Content */}
                        <div className="flex flex-col gap-4 p-2 rounded-3xl bg-surface-muted/30 border border-surface-border/50 min-h-[500px]">
                            {column.companies.map(company => (
                                <motion.div
                                    layoutId={company._id}
                                    key={company._id}
                                    onClick={() => router.push(`/companies/${company._id}`)}
                                    className="p-5 rounded-2xl bg-surface-bg border border-surface-border shadow-sm hover:shadow-xl hover:border-brand-secondary/30 cursor-pointer group transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-surface-muted to-surface-muted/50 flex items-center justify-center text-text-bright font-black text-xs border border-surface-border">
                                            {company.name[0]}
                                        </div>
                                        <div className="px-2 py-1 rounded-lg bg-brand-secondary/5 text-[9px] font-black text-brand-secondary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Details
                                        </div>
                                    </div>

                                    <h3 className="text-sm font-black text-text-bright mb-1 group-hover:text-brand-secondary transition-colors truncate">
                                        {company.name}
                                    </h3>
                                    <p className="text-[11px] text-text-muted line-clamp-2 mb-4 font-medium leading-relaxed">
                                        {company.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-surface-border/50">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1 rounded-md bg-brand-secondary/10 text-brand-secondary mt-0.5">
                                                <TrendingUp size={10} />
                                            </div>
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{company.stage}</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-text-muted/40 uppercase tabular-nums">
                                            {new Date(company.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}

                            {column.companies.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center opacity-20 group">
                                    <GitBranch size={24} className="mb-2 text-text-muted" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">No Deals</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
