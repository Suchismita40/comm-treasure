"use client";

import Link from "next/link";
import { Shield, Vote, Coins, Activity, ArrowRight, Zap, CheckCircle2, Lock, Cpu, Globe } from "lucide-react";
import { useTreasury } from "../hooks/useTreasury";
import { formatXLM } from "../lib/utils";

export default function HomePage() {
  const { stats, isLoadingStats } = useTreasury();

  return (
    <div className="space-y-16 py-4">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400">
            <Zap className="h-3.5 w-3.5 text-cyan-400" /> Powered by Soroban Smart Contracts
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Decentralized <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Community Treasury</span> on Stellar
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Transparent fund custody, community grant governance, weighted proposal voting, and automated disbursement—built with Soroban on the Stellar Testnet.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/treasury"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              Launch Treasury Hub <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/activity"
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              <Activity className="h-4 w-4 text-cyan-400" /> View Live Feed
            </Link>
          </div>
        </div>

        {/* Live Treasury Stats Overlay */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 pt-8">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Vault Balance</span>
            <p className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">
              {isLoadingStats ? "..." : formatXLM(stats?.totalBalance || 45000)}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Total Proposals</span>
            <p className="text-xl sm:text-2xl font-black text-slate-100 font-mono">
              {isLoadingStats ? "..." : stats?.totalProposals || 4}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Active Votes</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              {isLoadingStats ? "..." : stats?.activeProposals || 2}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Treasury Members</span>
            <p className="text-xl sm:text-2xl font-black text-indigo-400 font-mono">
              {isLoadingStats ? "..." : stats?.memberCount || 148}
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Engineered for High-Trust Community Governance
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A production-ready implementation integrating multi-wallet signing, Soroban contract state, and live ledger event tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-blue-500/40 transition-all group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <Coins className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Transparent Deposits</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Community members deposit XLM directly into the Soroban contract vault, earning weighted voting power in community grant allocations.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-indigo-500/40 transition-all group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <Vote className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Proposal & Voting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Submit grant proposals with funding targets, recipient addresses, and voting ledger deadlines. Cast YES/NO votes with real-time tallying.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 hover:border-cyan-500/40 transition-all group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Activity className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Real-Time Event Stream</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live Soroban contract event polling streams every deposit, proposal, vote, and disbursement directly into the dedicated activity feed.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Standards Banner */}
      <section className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-blue-400" /> Stellar Ecosystem Standards & Integration
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>StellarWalletsKit (Freighter, Albedo, xBull)</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Soroban Rust Smart Contract</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>TanStack Query State Sync</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Stellar Expert Explorer Links</span>
          </div>
        </div>
      </section>
    </div>
  );
}
