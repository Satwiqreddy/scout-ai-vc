'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Building2,
  Zap,
  Search,
  Plus,
  ChevronRight,
  Users,
  BarChart3,
  Orbit,
  Sparkles,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const stats = [
  { name: 'Companies Sourced', value: '1,284', change: '+12%', icon: Building2 },
  { name: 'High Signal Found', value: '42', change: '+18%', icon: Zap },
  { name: 'Thesis Matching', value: '94%', change: '+5%', icon: Target },
  { name: 'Active Scouts', value: '8', change: '0%', icon: Users },
];

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Hero / Greeting */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-secondary font-bold text-sm uppercase tracking-[0.2em]">
            <Sparkles className="w-4 h-4 fill-current" />
            Intelligence Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-bright">
            Good morning, <span className="text-gradient">Jane.</span>
          </h1>
          <p className="text-text-muted text-lg max-w-xl">
            Here's what happened in your thesis areas while you were away.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/companies" className="flex items-center gap-2 px-6 py-3 bg-surface-bg border border-surface-border rounded-2xl font-bold hover:bg-surface-muted transition-all shadow-sm">
            Explore Directory
          </Link>
          <button className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white dark:bg-foreground dark:text-background rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-primary/10">
            <Plus className="w-4 h-4" />
            New Search
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={stat.name}
            className="premium-card p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-surface-muted rounded-2xl border border-surface-border text-text-main group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "px-2 py-1 rounded-lg text-xs font-bold",
                stat.change.startsWith('+') ? "text-green-600 bg-green-50 dark:bg-green-900/10" : "text-text-muted bg-surface-muted"
              )}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-bold text-text-muted uppercase tracking-wider">{stat.name}</p>
            <p className="text-3xl font-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Market Trends (Wide) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="premium-card p-8 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-brand-secondary" />
                Rising Market Signals
              </h3>
              <button className="text-sm font-bold text-text-muted hover:text-brand-secondary">
                View trends report →
              </button>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Generative AI Infrastructure', signal: 'Exponential Growth', score: 98 },
                { label: 'Open Source Security Layer', signal: 'High Momentum', score: 84 },
                { label: 'Autonomous Agents', signal: 'Emerging Pattern', score: 72 },
              ].map((trend) => (
                <div key={trend.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{trend.label}</span>
                    <span className="text-xs font-bold px-2 py-1 bg-brand-secondary/5 text-brand-secondary rounded-lg">
                      {trend.signal}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-surface-muted rounded-full">
                    <div className="h-full bg-gradient-to-r from-brand-secondary to-brand-accent rounded-full transition-all duration-1000" style={{ width: `${trend.score}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <Orbit className="absolute -bottom-8 -right-8 w-48 h-48 text-brand-secondary/5 -rotate-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="premium-card p-6 bg-brand-secondary/5 border-brand-secondary/10">
              <h4 className="font-bold flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 fill-brand-secondary text-brand-secondary" />
                Live Feed
              </h4>
              <p className="text-sm text-text-muted mb-4 font-medium">
                4 new companies matching "Next-Gen DevTools" discovered in the last hour.
              </p>
              <Link href="/companies" className="text-xs font-bold text-brand-secondary uppercase tracking-widest hover:underline">
                Review Now →
              </Link>
            </div>
            <div className="premium-card p-6 bg-brand-accent/5 border-brand-accent/10">
              <h4 className="font-bold flex items-center gap-2 mb-2">
                <ArrowUpRight className="w-4 h-4 text-brand-accent" />
                Thesis Update
              </h4>
              <p className="text-sm text-text-muted mb-4 font-medium">
                "Fintech Series B" thesis is 30% more active compared to last quarter.
              </p>
              <button className="text-xs font-bold text-brand-accent uppercase tracking-widest hover:underline">
                View Details →
              </button>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="premium-card p-6 bg-gradient-to-br from-brand-primary to-slate-900 text-white dark:from-white dark:to-slate-200 dark:text-black shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Start Sourcing</h3>
            <p className="text-sm opacity-80 mb-6 leading-relaxed">
              Launch our AI scout to crawl over 500+ signals and surface the top 1% for your fund.
            </p>
            <button className="w-full py-3 bg-brand-secondary rounded-2xl font-bold text-white shadow-lg shadow-brand-secondary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Configure Scout
            </button>
          </div>

          <div className="premium-card p-6">
            <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-text-muted">Top Portfolios</h3>
            <div className="space-y-4">
              {[
                { name: 'OpenAI', location: 'San Francisco', valuation: '$80B+' },
                { name: 'Stripe', location: 'South SF', valuation: '$65B' },
                { name: 'Mistral AI', location: 'Paris', valuation: '$6B' },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-muted flex items-center justify-center text-sm font-bold">
                    {item.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-wide font-bold">{item.location}</p>
                  </div>
                  <span className="text-xs font-black">{item.valuation}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 text-xs font-bold text-text-muted hover:bg-surface-muted rounded-xl border border-dashed border-surface-border transition-all">
              Manage Portfolio
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
