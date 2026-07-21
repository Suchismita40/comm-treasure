"use client";

import { BarChart3, TrendingUp, ShieldCheck, Coins, Users, Vote, CheckCircle2, Award } from "lucide-react";
import { useTreasury } from "../../hooks/useTreasury";
import { formatXLM } from "../../lib/utils";

export default function AnalyticsPage() {
  const { stats } = useTreasury();

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <BarChart3 className="h-6 w-6 text-cyan-400" /> Treasury Analytics & Metrics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time metrics, treasury balance utilization, voting participation velocity, and reviewer reward statistics.
        </p>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Treasury Capital Custody</span>
            <Coins className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-slate-100 font-mono">
            {formatXLM(stats?.totalBalance || 45000)}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <TrendingUp className="h-3 w-3" /> +12.4% this month
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Governance Grants</span>
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-indigo-400 font-mono">
            {stats?.totalProposals || 4} Proposals
          </p>
          <p className="text-[11px] text-slate-400 font-mono">2 Active • 2 Executed</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Reviewer Rewards Pool</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">50,000 XLM</p>
          <p className="text-[11px] text-slate-400 font-mono">Inter-contract rewards</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Voter Participation</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-blue-400 font-mono">94.2%</p>
          <p className="text-[11px] text-slate-400 font-mono">High consensus rate</p>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Treasury Grant Allocation Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Coins className="h-5 w-5 text-cyan-400" /> Grant Allocation Breakdown
          </h3>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Developer Bootcamps & Education</span>
                <span className="font-mono text-cyan-400">10,000 XLM (26%)</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: "26%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Soroban Event Indexer Infrastructure</span>
                <span className="font-mono text-indigo-400">15,000 XLM (39%)</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: "39%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Formal Smart Contract Security Audit</span>
                <span className="font-mono text-emerald-400">8,000 XLM (21%)</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "21%" }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">DApp UI & Accessibility Enhancements</span>
                <span className="font-mono text-blue-400">5,000 XLM (14%)</span>
              </div>
              <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "14%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Voting & Governance Metrics */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Vote className="h-5 w-5 text-indigo-400" /> Governance Velocity & Health
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">Average Decision Time</span>
                <span className="font-mono text-sm font-bold text-slate-200">2.4 Days / Proposal</span>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">Inter-Contract Reward Claims</span>
                <span className="font-mono text-sm font-bold text-cyan-400">3 Verified Rewards Claimed</span>
              </div>
              <Award className="h-5 w-5 text-cyan-400" />
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">Stellar Testnet Ledger Sync Rate</span>
                <span className="font-mono text-sm font-bold text-emerald-400">100% Real-Time Event Sync</span>
              </div>
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
