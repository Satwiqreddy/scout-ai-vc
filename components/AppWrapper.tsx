'use client';

import React, { useState, createContext, useContext, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import {
    Search,
    Bell,
    Command,
    Settings,
    ChevronDown,
    Sparkles,
    Search as SearchIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const UIContext = createContext<{
    isCollapsed: boolean;
    setIsCollapsed: (v: boolean) => void;
}>({
    isCollapsed: false,
    setIsCollapsed: () => { },
});

export const useUI = () => useContext(UIContext);

export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');
    const router = useRouter();

    const handleGlobalSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && globalSearch.trim()) {
            router.push(`/companies?q=${encodeURIComponent(globalSearch)}`);
        }
    };

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <UIContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            <div className="flex min-h-screen bg-background text-foreground">
                <Sidebar />
                <div className={cn(
                    "flex-1 flex flex-col min-h-screen transition-all duration-500 ease-in-out",
                    isCollapsed ? "ml-[var(--sidebar-collapsed-width)]" : "ml-[var(--sidebar-width)]"
                )}>
                    {/* Global Search Header */}
                    <header className={cn(
                        "sticky top-0 z-30 transition-all duration-300 px-8 py-4 flex items-center justify-between",
                        scrolled ? "glass border-b border-surface-border py-3 bg-white/80 dark:bg-black/80" : "bg-transparent"
                    )}>
                        <div className="flex items-center gap-6 flex-1">
                            <div className="relative w-full max-w-md group">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <SearchIcon className="w-4 h-4 text-text-muted transition-colors group-focus-within:text-brand-secondary" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search entities, signals, or thesis..."
                                    className="w-full pl-11 pr-4 py-2.5 bg-surface-muted/50 border border-transparent focus:border-brand-secondary/30 focus:bg-surface-bg rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-secondary/5 transition-all"
                                    value={globalSearch}
                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                    onKeyDown={handleGlobalSearch}
                                />
                                <div className="absolute right-4 inset-y-0 flex items-center">
                                    <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-surface-border bg-surface-bg text-[10px] font-black text-text-muted opacity-50 uppercase tracking-tighter">
                                        <Command size={10} />
                                        K
                                    </kbd>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="p-2.5 rounded-xl hover:bg-surface-muted transition-colors relative">
                                <Bell size={20} className="text-text-muted" />
                                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-secondary border-2 border-surface-bg" />
                            </button>

                            <div className="h-6 w-px bg-surface-border mx-2" />

                            <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl hover:bg-surface-muted transition-all group">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-secondary to-purple-500 flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-brand-secondary/10 group-hover:scale-105 transition-transform">
                                    JD
                                </div>
                                <div className="hidden md:flex flex-col items-start leading-none gap-1">
                                    <span className="text-[11px] font-black tracking-tight">Jane Doe</span>
                                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Managing Partner</span>
                                </div>
                                <ChevronDown size={14} className="text-text-muted group-hover:text-text-high transition-colors" />
                            </button>
                        </div>
                    </header>

                    <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">
                        {children}
                    </main>
                </div>
            </div>
        </UIContext.Provider>
    );
}
