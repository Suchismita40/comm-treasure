"use client";

import { useContractEvents } from "../../hooks/useContractEvents";
import { STELLAR_CONFIG } from "../../lib/config";
import { EventType } from "../../types/treasury";
import { formatAddress, formatTimestamp } from "../../lib/utils";
import {
  Activity,
  RefreshCw,
  ExternalLink,
  Coins,
  PlusCircle,
  Vote,
  Play,
  Filter,
  Radio,
} from "lucide-react";

export default function ActivityPage() {
  const {
    events,
    allEventsCount,
    filterType,
    isLivePolling,
    isLoading,
    setFilterType,
    toggleLivePolling,
    refreshEvents,
  } = useContractEvents();

  const getEventBadge = (type: EventType) => {
    switch (type) {
      case "Deposit":
        return {
          icon: Coins,
          color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          label: "Vault Deposit",
        };
      case "ProposalCreated":
        return {
          icon: PlusCircle,
          color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          label: "Proposal Created",
        };
      case "VoteSubmitted":
        return {
          icon: Vote,
          color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
          label: "Vote Submitted",
        };
      case "ProposalExecuted":
        return {
          icon: Play,
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          label: "Proposal Executed",
        };
      default:
        return {
          icon: Activity,
          color: "bg-slate-500/10 text-slate-400 border-slate-500/20",
          label: type,
        };
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <Activity className="h-6 w-6 text-cyan-400" /> Real-Time Soroban Event Stream
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live decentralized event stream emitting directly from Soroban smart contract operations on Stellar Testnet.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLivePolling}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isLivePolling
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm"
                : "bg-slate-900 text-slate-400 border-slate-800"
            }`}
          >
            <Radio className={`h-3.5 w-3.5 ${isLivePolling ? "animate-pulse text-emerald-400" : ""}`} />
            {isLivePolling ? "Live Sync Active" : "Sync Paused"}
          </button>

          <button
            onClick={refreshEvents}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Event Filters Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Filter className="h-4 w-4 text-blue-400" /> Event Type Filter:
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(["ALL", "Deposit", "ProposalCreated", "VoteSubmitted", "ProposalExecuted"] as const).map(
            (type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  filterType === type
                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20"
                    : "bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                {type === "ALL" ? `All Events (${allEventsCount})` : type}
              </button>
            )
          )}
        </div>
      </div>

      {/* Events Timeline List */}
      <div className="space-y-4">
        {events.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs rounded-2xl border border-dashed border-slate-800 bg-slate-900/20">
            No contract events recorded for this filter category yet.
          </div>
        ) : (
          events.map((evt) => {
            const badge = getEventBadge(evt.type);
            const Icon = badge.icon;

            return (
              <div
                key={evt.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700/80 transition-all shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl border ${badge.color} shrink-0 mt-0.5 sm:mt-0`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {formatTimestamp(evt.timestamp)}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-200">{evt.details}</p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>Actor:</span>
                      <a
                        href={`${STELLAR_CONFIG.explorerUrl}/account/${evt.walletAddress}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {formatAddress(evt.walletAddress, 6)} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Tx Hash Link */}
                <div className="self-end sm:self-center shrink-0">
                  <a
                    href={`${STELLAR_CONFIG.explorerUrl}/tx/${evt.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono transition-colors"
                  >
                    Hash: {formatAddress(evt.txHash, 4)} <ExternalLink className="h-3 w-3 text-cyan-400" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
