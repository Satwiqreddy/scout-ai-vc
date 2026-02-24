'use client';

import React, { useState, useEffect } from 'react';
import {
    ListTodo,
    Plus,
    MoreVertical,
    Download,
    ChevronRight,
    ExternalLink,
    Sparkles,
    Command,
    ArrowRight,
    Trash2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { mockCompanies } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';
import { getStorageItem, setStorageItem, downloadCSV } from '@/lib/storage';

interface List {
    id: string;
    name: string;
    count: number;
    companies: string[];
    lastUpdated: string;
}

export default function ListsPage() {
    const [lists, setLists] = useState<List[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const initialLists = [
            { id: 'l1', name: 'GenAI Seed Thesis', count: 3, companies: ['1', '4', '5'], lastUpdated: '2024-03-20' },
            { id: 'l2', name: 'Fintech Series B+', count: 1, companies: ['2'], lastUpdated: '2024-03-15' },
            { id: 'l3', name: 'Frontend Infrastructure', count: 1, companies: ['3'], lastUpdated: '2024-03-10' }
        ];
        setLists(getStorageItem('vc_lists', initialLists));
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            setStorageItem('vc_lists', lists);
        }
    }, [lists, isLoaded]);

    const handleExport = (list: List) => {
        const data = list.companies.map(id => {
            const c = mockCompanies.find(comp => comp.id === id);
            return {
                Name: c?.name || 'Unknown',
                Sector: c?.sector || '',
                Stage: c?.stage || '',
                Funding: c?.fundingTotal || '',
                Website: c?.website || ''
            };
        });
        downloadCSV(`${list.name.replace(/\s+/g, '_')}.csv`, data);
    };

    const deleteList = (id: string) => {
        setLists(lists.filter(l => l.id !== id));
    };

    const createList = () => {
        const name = prompt("Enter list name:");
        if (!name) return;
        const newList: List = {
            id: Math.random().toString(36).substr(2, 9),
            name: name,
            count: 0,
            companies: [],
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        setLists([...lists, newList]);
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
                        Sourcing Pipelines
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-text-bright">My Lists</h1>
                    <p className="text-text-muted font-medium">Organize companies into custom sourcing pipelines.</p>
                </div>
                <button
                    onClick={createList}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white dark:bg-foreground dark:text-background rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-brand-primary/10"
                >
                    <Plus className="w-4 h-4" />
                    Create Pipeline
                </button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                    {lists.map((list, i) => (
                        <motion.div
                            key={list.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.1 }}
                            className="premium-card p-8 group flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="w-14 h-14 rounded-[1.25rem] bg-brand-secondary/10 flex items-center justify-center text-brand-secondary group-hover:scale-110 group-hover:bg-brand-secondary group-hover:text-white transition-all duration-300">
                                    <ListTodo className="w-7 h-7" />
                                </div>
                                <div className="flex items-center gap-1 opacity-100">
                                    <button
                                        onClick={() => handleExport(list)}
                                        className="p-2 text-text-muted hover:bg-surface-muted rounded-xl transition-colors"
                                        title="Export to CSV"
                                    >
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteList(list.id)}
                                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-2xl font-black mb-1 tracking-tight">{list.name}</h3>
                                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-8">Updated {list.lastUpdated}</p>

                                <div className="space-y-4 mb-8 text-left">
                                    {list.companies.slice(0, 3).map((compId) => {
                                        const company = mockCompanies.find(c => c.id === compId);
                                        return company ? (
                                            <div key={compId} className="flex items-center justify-between group/item">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-surface-muted border border-surface-border flex items-center justify-center text-[10px] font-black text-text-muted group-hover/item:border-brand-secondary group-hover/item:text-brand-secondary transition-colors">
                                                        {company.name[0]}
                                                    </div>
                                                    <span className="text-sm font-bold group-hover/item:text-brand-secondary transition-colors">{company.name}</span>
                                                </div>
                                                <ExternalLink className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                            </div>
                                        ) : null;
                                    })}
                                    {list.companies.length > 3 && (
                                        <p className="text-[10px] font-bold text-text-muted px-2">+{list.companies.length - 3} more items...</p>
                                    )}
                                    {list.companies.length === 0 && (
                                        <p className="text-sm font-medium text-text-muted/40 italic">No items added yet</p>
                                    )}
                                </div>
                            </div>

                            <Link
                                href="/companies"
                                className="w-full py-3.5 bg-surface-muted hover:bg-brand-secondary hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-brand-secondary/10"
                            >
                                Review {list.companies.length} Entities
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <motion.button
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={createList}
                    className="border-2 border-dashed border-surface-border rounded-[2rem] p-8 flex flex-col items-center justify-center text-text-muted hover:border-brand-secondary hover:bg-brand-secondary/[0.02] hover:text-brand-secondary transition-all min-h-[340px] group"
                >
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8" />
                    </div>
                    <span className="font-black text-xl tracking-tight">New Pipeline</span>
                    <p className="text-sm font-medium opacity-60 mt-2">Filter and group your target entities</p>
                </motion.button>
            </div>
        </div>
    );
}
