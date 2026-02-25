'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
    Building2,
    Search,
    Plus,
    MapPin,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Command,
    ArrowRight,
    ArrowUpDown,
    ArrowUp,
    ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockCompanies } from '@/lib/mock-data';
import { motion, AnimatePresence } from 'framer-motion';

import { useSearchParams } from 'next/navigation';
import { getStorageItem, setStorageItem } from '@/lib/storage';
import { Company } from '@/lib/mock-data';

type SortKey = 'name' | 'stage' | 'fundingTotal' | 'sector';

export default function CompaniesPage() {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState('');
    const [activeSector, setActiveSector] = useState<string>('All');
    const [isLoading, setIsLoading] = useState(true);
    const [allCompanies, setAllCompanies] = useState<Company[]>(mockCompanies);

    useEffect(() => {
        const query = searchParams.get('q');
        if (query) setSearch(query);
    }, [searchParams]);

    const sectors = ['All', 'Artificial Intelligence', 'Fintech', 'Developer Tools', 'SaaS'];

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        // Load custom companies
        const customCompanies = getStorageItem('vc_custom_companies', []);
        setAllCompanies([...mockCompanies, ...customCompanies]);
        return () => clearTimeout(timer);
    }, []);
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        // Load custom companies
        const customCompanies = getStorageItem('vc_custom_companies', []);
        setAllCompanies([...mockCompanies, ...customCompanies]);
        return () => clearTimeout(timer);
    }, []);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
        setCurrentPage(1);
    };

    const handleAddEntity = (newCompany: Company) => {
        const customCompanies = getStorageItem('vc_custom_companies', []);
        const updatedCustom = [...customCompanies, newCompany];
        setStorageItem('vc_custom_companies', updatedCustom);
        setAllCompanies([...mockCompanies, ...updatedCustom]);
        setIsAddModalOpen(false);
    };

    const filteredAndSortedCompanies = useMemo(() => {
        let result = allCompanies.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.description.toLowerCase().includes(search.toLowerCase());
            const matchesSector = activeSector === 'All' || c.sector === activeSector;
            return matchesSearch && matchesSector;
        });

        result.sort((a, b) => {
            let valA: string | number = a[sortKey];
            let valB: string | number = b[sortKey];

            if (sortKey === 'fundingTotal') {
                valA = parseFloat(a.fundingTotal.replace(/[^0-9.]/g, '')) || 0;
                valB = parseFloat(b.fundingTotal.replace(/[^0-9.]/g, '')) || 0;
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [search, activeSector, sortKey, sortOrder]);

    const paginatedCompanies = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedCompanies.slice(start, start + itemsPerPage);
    }, [filteredAndSortedCompanies, currentPage]);

    const totalPages = Math.ceil(filteredAndSortedCompanies.length / itemsPerPage);

    const SortIcon = ({ k }: { k: SortKey }) => {
        if (sortKey !== k) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-30" />;
        return sortOrder === 'asc' ? <ArrowUp className="w-3 h-3 ml-1 text-brand-secondary" /> : <ArrowDown className="w-3 h-3 ml-1 text-brand-secondary" />;
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-brand-secondary font-bold text-xs uppercase tracking-[0.2em] mb-2">
                        <Command className="w-3.5 h-3.5" />
                        Sourcing Engine
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-text-bright">Discovery</h1>
                    <p className="text-text-muted font-medium">Explore high-signal companies matching your thesis.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white dark:bg-foreground dark:text-background rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-brand-primary/10"
                    >
                        <Plus className="w-4 h-4" />
                        Add Entity
                    </button>
                </div>
            </motion.div>

            {/* Controls */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col md:flex-row items-center justify-between gap-4 p-2 bg-surface-muted/50 rounded-[2rem] border border-surface-border"
            >
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Quick search..."
                        className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none font-medium placeholder:text-text-muted/60"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1">
                    {sectors.map(sector => (
                        <button
                            key={sector}
                            onClick={() => { setActiveSector(sector); setCurrentPage(1); }}
                            className={cn(
                                "px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all",
                                activeSector === sector
                                    ? "bg-surface-bg border border-surface-border text-brand-secondary shadow-sm"
                                    : "text-text-muted hover:text-text-main"
                            )}
                        >
                            {sector}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Results Table */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="premium-card overflow-hidden"
            >
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-muted/30 border-b border-surface-border">
                            <th
                                className="px-8 py-5 text-[11px] font-black text-text-muted uppercase tracking-widest cursor-pointer hover:text-text-main"
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center">Company Entity <SortIcon k="name" /></div>
                            </th>
                            <th
                                className="px-8 py-5 text-[11px] font-black text-text-muted uppercase tracking-widest cursor-pointer hover:text-text-main"
                                onClick={() => handleSort('stage')}
                            >
                                <div className="flex items-center">Stage & Capital <SortIcon k="stage" /></div>
                            </th>
                            <th
                                className="px-8 py-5 text-[11px] font-black text-text-muted uppercase tracking-widest cursor-pointer hover:text-text-main"
                                onClick={() => handleSort('sector')}
                            >
                                <div className="flex items-center">Intelligence Sector <SortIcon k="sector" /></div>
                            </th>
                            <th className="px-8 py-5 text-[11px] font-black text-text-muted uppercase tracking-widest text-right">Access</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                        <AnimatePresence mode="popLayout">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={`skeleton-${i}`} className="animate-pulse">
                                        <td className="px-8 py-6 flex items-center gap-4">
                                            <div className="w-12 h-12 bg-surface-muted rounded-2xl" />
                                            <div className="space-y-2">
                                                <div className="w-32 h-4 bg-surface-muted rounded" />
                                                <div className="w-20 h-3 bg-surface-muted rounded" />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6"><div className="w-24 h-4 bg-surface-muted rounded" /></td>
                                        <td className="px-8 py-6"><div className="w-40 h-4 bg-surface-muted rounded" /></td>
                                        <td className="px-8 py-6 text-right"><div className="w-6 h-6 bg-surface-muted rounded-lg ml-auto" /></td>
                                    </tr>
                                ))
                            ) : (
                                paginatedCompanies.map((company, i) => (
                                    <motion.tr
                                        key={company.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group hover:bg-surface-muted/40 transition-colors cursor-pointer"
                                    >
                                        <td className="px-8 py-5">
                                            <Link href={`/companies/${company.id}`} className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-surface-muted flex items-center justify-center border border-surface-border group-hover:border-brand-secondary/40 group-hover:bg-brand-secondary/5 transition-all">
                                                    <span className="font-black text-xl text-text-muted group-hover:text-brand-secondary">{company.name[0]}</span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-black text-lg group-hover:text-brand-secondary transition-colors leading-tight">{company.name}</span>
                                                        <Sparkles className="w-3.5 h-3.5 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                    <p className="text-xs font-bold text-text-muted flex items-center gap-1 mt-1">
                                                        <GlobeIcon className="w-3 h-3" />
                                                        {company.website.replace('https://', '')}
                                                    </p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black">{company.stage}</span>
                                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">{company.fundingTotal} Raised</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-wrap gap-1.5">
                                                {company.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="px-3 py-1 rounded-lg bg-surface-muted border border-surface-border text-[10px] font-black text-text-muted uppercase tracking-tight">
                                                        {tag}
                                                    </span>
                                                ))}
                                                <span className="px-3 py-1 rounded-lg bg-brand-secondary/5 border border-brand-secondary/10 text-[10px] font-black text-brand-secondary uppercase tracking-tight">
                                                    {company.sector.split(' ')[0]}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Link
                                                href={`/companies/${company.id}`}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-muted border border-surface-border hover:bg-brand-secondary hover:text-white group-hover:border-brand-secondary/40 transition-all active:scale-95"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </AnimatePresence>
                    </tbody>
                </table>

                {!isLoading && paginatedCompanies.length === 0 && (
                    <div className="p-20 text-center animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-surface-muted rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-surface-border scale-110">
                            <Search className="w-8 h-8 text-text-muted/40" />
                        </div>
                        <h3 className="font-black text-2xl tracking-tight">No entities found</h3>
                        <p className="text-text-muted mt-2 font-medium max-w-xs mx-auto">Try refining your thesis search or broadening your filters.</p>
                        <button
                            onClick={() => { setSearch(''); setActiveSector('All'); setCurrentPage(1); }}
                            className="mt-8 text-sm font-black text-brand-secondary uppercase tracking-widest hover:underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Pagination Controls */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col md:flex-row items-center justify-between px-4 pt-4 border-t border-surface-border"
            >
                <div className="flex items-center gap-6 text-xs font-bold text-text-muted uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-brand-secondary shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        Showing {paginatedCompanies.length} of {filteredAndSortedCompanies.length} Entities
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl border border-surface-border hover:bg-surface-muted disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="px-4 text-sm font-black text-text-main">
                            Page {currentPage} of {totalPages || 1}
                        </div>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 rounded-xl border border-surface-border hover:bg-surface-muted disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-surface-border text-sm font-bold text-text-muted hover:bg-surface-muted transition-all">
                        Export Full CSV
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

            <AddEntityModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddEntity}
            />
        </div>
    );
}

function AddEntityModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (c: Company) => void }) {
    const [name, setName] = useState('');
    const [website, setWebsite] = useState('');
    const [sector, setSector] = useState('SaaS');
    const [stage, setStage] = useState<Company['stage']>('Seed');
    const [funding, setFunding] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCompany: Company = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            website: website.startsWith('http') ? website : `https://${website}`,
            description: `${name} is a high-potential venture in the ${sector} sector.`,
            sector,
            stage,
            fundingTotal: funding || '$0',
            location: location || 'Remote',
            founded: new Date().getFullYear(),
            tags: [sector, stage],
            signals: []
        };
        onAdd(newCompany);
        setName('');
        setWebsite('');
        setFunding('');
        setLocation('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-lg bg-surface-bg border border-surface-border rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8 border-b border-surface-border flex items-center justify-between bg-surface-muted/30">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Add New Entity</h2>
                                <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-1">Intelligence Database Entry</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-surface-muted rounded-xl transition-colors">
                                <Plus className="w-6 h-6 rotate-45 text-text-muted" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Company Name</label>
                                    <input
                                        required
                                        className="w-full bg-surface-muted/50 border border-surface-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-brand-secondary transition-all"
                                        placeholder="Acme AI"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Website URL</label>
                                    <input
                                        required
                                        className="w-full bg-surface-muted/50 border border-surface-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-brand-secondary transition-all"
                                        placeholder="acme.ai"
                                        value={website}
                                        onChange={e => setWebsite(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Sector</label>
                                    <select
                                        className="w-full bg-surface-muted/50 border border-surface-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-brand-secondary transition-all"
                                        value={sector}
                                        onChange={e => setSector(e.target.value)}
                                    >
                                        <option>Artificial Intelligence</option>
                                        <option>Fintech</option>
                                        <option>Developer Tools</option>
                                        <option>SaaS</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Funding Stage</label>
                                    <select
                                        className="w-full bg-surface-muted/50 border border-surface-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-brand-secondary transition-all"
                                        value={stage}
                                        onChange={e => setStage(e.target.value as any)}
                                    >
                                        <option>Stealth</option>
                                        <option>Seed</option>
                                        <option>Series A</option>
                                        <option>Series B</option>
                                        <option>Series C+</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Capital Raised</label>
                                    <input
                                        className="w-full bg-surface-muted/50 border border-surface-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-brand-secondary transition-all"
                                        placeholder="$5M"
                                        value={funding}
                                        onChange={e => setFunding(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted pl-1">Location</label>
                                    <input
                                        className="w-full bg-surface-muted/50 border border-surface-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-brand-secondary transition-all"
                                        placeholder="London, UK"
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest bg-surface-muted text-text-muted hover:bg-surface-border transition-all"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] py-4 bg-brand-secondary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-brand-secondary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Index Entity
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function GlobeIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20" /><path d="M2 12h20" />
        </svg>
    );
}
