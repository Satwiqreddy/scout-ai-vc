'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Building2,
    ListTodo,
    Bookmark,
    TrendingUp,
    LayoutDashboard,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    Zap,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useUI } from './AppWrapper';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Lists', href: '/lists', icon: ListTodo },
    { name: 'Saved Searches', href: '/saved', icon: Bookmark },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, setIsCollapsed, logout, user } = useUI();

    return (
        <motion.aside
            initial={false}
            animate={{
                width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
                backgroundColor: 'var(--color-sidebar-bg)'
            }}
            className="fixed left-0 top-0 h-screen border-r border-sidebar-border flex flex-col z-50 overflow-hidden shadow-2xl transition-colors duration-300"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-brand-secondary/10 to-transparent pointer-events-none" />

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute right-4 top-8 p-1.5 rounded-lg bg-surface-muted border border-surface-border text-text-muted hover:text-brand-secondary hover:bg-surface-bg transition-all z-20"
            >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <div className="p-6 relative flex flex-col h-full">
                {/* Logo Section */}
                <div
                    onClick={() => isCollapsed && setIsCollapsed(false)}
                    className={cn(
                        "flex items-center gap-3 mb-10 group cursor-pointer transition-all",
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-secondary to-brand-accent flex items-center justify-center shadow-lg shadow-brand-secondary/20 group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex flex-col whitespace-nowrap"
                            >
                                <span className="font-black text-lg tracking-tight leading-none text-text-bright">VC Scout</span>
                                <span className="text-[9px] font-black text-brand-secondary uppercase tracking-[0.2em] mt-1">Intelligence</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 flex-1">
                    {navItems.map((item) => {
                        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center group px-4 py-3 rounded-2xl transition-all duration-300",
                                    isActive
                                        ? "text-brand-secondary bg-brand-secondary/5 font-bold"
                                        : "text-sidebar-text hover:text-text-bright hover:bg-sidebar-active/5",
                                    isCollapsed ? "justify-center px-0 w-12 mx-auto" : "gap-4"
                                )}
                            >
                                <item.icon className={cn("shrink-0 w-5 h-5 transition-colors duration-300", isActive ? "text-brand-secondary" : "text-sidebar-text group-hover:text-text-bright")} />
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-[14px] whitespace-nowrap"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                                {isActive && !isCollapsed && (
                                    <motion.div
                                        layoutId="activeDot"
                                        className="absolute right-4 w-1.5 h-1.5 rounded-full bg-brand-secondary shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Area */}
                <div className={cn("mt-auto pt-6", isCollapsed ? "flex flex-col items-center" : "")}>
                    <div className="mb-4">
                        <button
                            onClick={logout}
                            className={cn(
                                "flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group",
                                isCollapsed ? "justify-center px-0 w-12" : ""
                            )}
                        >
                            <LogOut className="w-5 h-5" />
                            {!isCollapsed && <span className="text-sm font-black">Sign Out</span>}
                        </button>
                    </div>

                    {!isCollapsed ? (
                        <div className="p-4 rounded-3xl bg-surface-muted border border-surface-border mb-6 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                <Settings size={14} className="text-text-muted" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs shadow-lg">
                                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                </div>
                                <div className="flex flex-col overflow-hidden text-left">
                                    <span className="text-sm font-black text-text-bright truncate">{user?.name || 'User'}</span>
                                    <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider truncate">{user?.email || 'Managing Partner'}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-2xl bg-surface-muted border border-surface-border flex items-center justify-center mb-6 cursor-pointer hover:bg-surface-hover transition-colors">
                            <span className="text-[10px] font-black text-text-muted">{user?.name?.split(' ').map(n => n[0]).join('') || 'U'}</span>
                        </div>
                    )}

                    <div className={cn(
                        "flex items-center justify-between text-[9px] font-black text-text-muted/40 uppercase tracking-[0.2em]",
                        isCollapsed ? "flex-col gap-2" : "px-2"
                    )}>
                        {!isCollapsed && <span>v2.4.0</span>}
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                            {!isCollapsed && <span>Live</span>}
                        </div>
                    </div>
                </div>
            </div>
        </motion.aside>
    );
}
