'use client';

import React, { useState } from 'react';
import { useUI } from '@/components/AppWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    Lock,
    Mail,
    ArrowRight,
    Sparkles,
    User,
    Github,
    Linkedin,
    Chrome
} from 'lucide-react';

export default function LoginPage() {
    const { login } = useUI();
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/signup';
            const body = mode === 'signin'
                ? { email, password }
                : { email, password, name };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                const message = data.details
                    ? `${data.error}: ${data.details}`
                    : data.error || 'Authentication failed';
                throw new Error(message);
            }

            if (mode === 'signin') {
                login(data.user);
            } else {
                setMode('signin');
                alert('Account created! Please sign in.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
            {/* Animated Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-secondary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md z-10"
            >
                {/* Logo & Header */}
                <div className="flex flex-col items-center mb-8">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-secondary to-brand-accent flex items-center justify-center shadow-2xl shadow-brand-secondary/20 mb-6 cursor-pointer"
                    >
                        <TrendingUp className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-black text-white tracking-tight text-center">
                        {mode === 'signin' ? 'Welcome back to' : 'Join the elite at'} <span className="text-brand-secondary">VC Scout</span>
                    </h1>
                    <p className="text-zinc-500 font-bold text-[10px] mt-3 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Sparkles size={12} className="text-brand-accent" />
                        Intelligence Platform
                        <Sparkles size={12} className="text-brand-accent" />
                    </p>
                </div>

                {/* Auth Card */}
                <div className="glass p-1 rounded-[2.5rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
                    <div className="bg-[#0f0f12] rounded-[2.4rem] p-8">
                        {/* Tab Switcher */}
                        <div className="flex p-1.5 bg-zinc-900/50 rounded-2xl mb-8">
                            <button
                                onClick={() => setMode('signin')}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'signin' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setMode('signup')}
                                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs font-bold"
                            >
                                <Lock size={14} />
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <AnimatePresence mode="wait">
                                {mode === 'signup' && (
                                    <motion.div
                                        key="fullname"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 group-focus-within:text-brand-secondary transition-colors" />
                                            <input
                                                type="text"
                                                required={mode === 'signup'}
                                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-secondary/50 focus:bg-white/[0.05] transition-all text-sm"
                                                placeholder="Arjun Reddy"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 pl-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 group-focus-within:text-brand-secondary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-secondary/50 focus:bg-white/[0.05] transition-all text-sm"
                                        placeholder="name@scout.ai"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Secret Key</label>
                                    <span className="text-[10px] font-bold text-brand-secondary cursor-pointer hover:underline">Forgot?</span>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500 group-focus-within:text-brand-secondary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-secondary/50 focus:bg-white/[0.05] transition-all text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-brand-secondary hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 mt-4 shadow-xl shadow-white/5 disabled:opacity-50 text-sm"
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                                    />
                                ) : (
                                    <>
                                        {mode === 'signin' ? 'Enter Platform' : 'Create Intelligence Account'}
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Social Auth */}
                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-px flex-1 bg-white/5" />
                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Or continue with</span>
                                <div className="h-px flex-1 bg-white/5" />
                            </div>

                            <div className="flex gap-3">
                                <button className="flex-1 py-3 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center hover:bg-white/[0.08] transition-all group">
                                    <Chrome className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                                </button>
                                <button className="flex-1 py-3 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center hover:bg-white/[0.08] transition-all group">
                                    <Linkedin className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                                </button>
                                <button className="flex-1 py-3 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center hover:bg-white/[0.08] transition-all group">
                                    <Github className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-10 text-center">
                    <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                        By entering, you agree to our <span className="text-zinc-400 hover:text-white cursor-pointer underline">Terms of Signal</span> <br />
                        and <span className="text-zinc-400 hover:text-white cursor-pointer underline">Investment Privacy Policy</span>.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
