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
    Search as SearchIcon,
    Moon,
    Sun,
    LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { getStorageItem, setStorageItem } from '@/lib/storage';

const UIContext = createContext<{
    isCollapsed: boolean;
    setIsCollapsed: (v: boolean) => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    isLoggedIn: boolean;
    user: { name: string; email: string } | null;
    login: (userData?: { name: string; email: string }) => void;
    logout: () => void;
}>({
    isCollapsed: false,
    setIsCollapsed: () => { },
    theme: 'dark',
    toggleTheme: () => { },
    isLoggedIn: false,
    user: null,
    login: () => { },
    logout: () => { },
});

export const useUI = () => useContext(UIContext);

export function AppWrapper({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [globalSearch, setGlobalSearch] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const login = (userData?: { name: string; email: string }) => {
        setIsLoggedIn(true);
        if (userData) {
            setUser(userData);
            setStorageItem('vc_user', userData);
        }
        setStorageItem('vc_auth', true);
        router.push('/');
    };

    const logout = async () => {
        setIsLoggedIn(false);
        setUser(null);
        setStorageItem('vc_auth', false);
        setStorageItem('vc_user', null);
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        }
        router.push('/login');
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        setStorageItem('vc_theme', newTheme);
        applyTheme(newTheme);
    };

    const applyTheme = (t: 'light' | 'dark') => {
        if (t === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light');
        }
    };

    useEffect(() => {
        setIsMounted(true);
        const savedTheme = getStorageItem('vc_theme', 'dark');
        setTheme(savedTheme);
        applyTheme(savedTheme);

        const auth = getStorageItem('vc_auth', false);
        setIsLoggedIn(auth);

        if (auth) {
            const savedUser = getStorageItem('vc_user', null);
            setUser(savedUser);
        }

        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMounted) {
            if (!isLoggedIn && pathname !== '/login') {
                router.push('/login');
            } else if (isLoggedIn && pathname === '/login') {
                router.push('/');
            }
        }
    }, [isLoggedIn, pathname, isMounted, router]);

    const handleGlobalSearch = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && globalSearch.trim()) {
            router.push(`/companies?q=${encodeURIComponent(globalSearch)}`);
        }
    };

    if (!isMounted) return null;

    // Don't show the App Shell (Sidebar/Header) on the Login page
    if (pathname === '/login') {
        return (
            <UIContext.Provider value={{ isCollapsed, setIsCollapsed, theme, toggleTheme, isLoggedIn, user, login, logout }}>
                {children}
            </UIContext.Provider>
        );
    }

    return (
        <UIContext.Provider value={{ isCollapsed, setIsCollapsed, theme, toggleTheme, isLoggedIn, user, login, logout }}>
            <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
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
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl hover:bg-surface-muted transition-colors relative group"
                                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={theme}
                                        initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {theme === 'light' ? (
                                            <Moon size={20} className="text-text-muted group-hover:text-brand-secondary" />
                                        ) : (
                                            <Sun size={20} className="text-text-muted group-hover:text-amber-500" />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </button>

                            <button className="p-2.5 rounded-xl hover:bg-surface-muted transition-colors relative">
                                <Bell size={20} className="text-text-muted" />
                                <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-secondary border-2 border-surface-bg" />
                            </button>

                            <div className="h-6 w-px bg-surface-border mx-2" />

                            <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl hover:bg-surface-muted transition-all group">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-secondary to-purple-500 flex items-center justify-center text-white font-black text-[10px] shadow-lg shadow-brand-secondary/10 group-hover:scale-105 transition-transform">
                                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                </div>
                                <div className="hidden md:flex flex-col items-start leading-none gap-1">
                                    <span className="text-[11px] font-black text-text-bright tracking-tight">{user?.name || 'Arjun Reddy'}</span>
                                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{user?.email || 'Managing Partner'}</span>
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
