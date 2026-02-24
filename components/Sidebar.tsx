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
    const { isCollapsed, setIsCollapsed } = useUI();

    return (
        <motion.aside
            initial={false}
            animate={{
                width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
                backgroundColor: '#0f172a' // Midnight Navy
            }}
            className="fixed left-0 top-0 h-screen border-r border-white/10 flex flex-col z-50 overflow-hidden text-white/70 shadow-2xl"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-brand-secondary/20 to-transparent pointer-events-none" />

            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute right-4 top-8 p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all z-20"
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
                                <span className="font-black text-lg tracking-tight leading-none text-white">VC Scout</span>
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
                                        ? "text-white bg-white/10"
                                        : "text-white/50 hover:text-white hover:bg-white/5",
                                    isCollapsed ? "justify-center px-0 w-12 mx-auto" : "gap-4"
                                )}
                            >
                                <item.icon className={cn("shrink-0 w-5 h-5 transition-colors duration-300", isActive ? "text-brand-secondary" : "text-white/40 group-hover:text-white")} />
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="font-bold text-[14px] whitespace-nowrap"
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
                    {!isCollapsed ? (
                        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md mb-6 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                <Settings size={14} />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xs shadow-lg">
                                    JD
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-black text-white truncate">Jane Doe</span>
                                    <span className="text-[10px] font-bold text-brand-secondary uppercase tracking-wider truncate">Managing Partner</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 cursor-pointer hover:bg-white/10 transition-colors">
                            <span className="text-[10px] font-black">JD</span>
                        </div>
                    )}

                    <div className={cn(
                        "flex items-center justify-between text-[9px] font-black text-white/20 uppercase tracking-[0.2em]",
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
