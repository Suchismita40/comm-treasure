"use client";

import { useState } from "react";
import { useTreasury } from "../../hooks/useTreasury";
import { useWalletStore } from "../../lib/store/useWalletStore";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { ProposalSkeleton } from "../../components/SkeletonLoaders";
import { EmptyState } from "../../components/EmptyState";
import { ProposalStatus } from "../../types/treasury";
import { formatAddress, formatXLM, formatTimestamp } from "../../lib/utils";
import {
  Vault,
  PlusCircle,
  Coins,
  ThumbsUp,
  ThumbsDown,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  X,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Layers,
} from "lucide-react";

export default function TreasuryPage() {
  const {
    stats,
    isLoadingStats,
    proposals,
    isLoadingProposals,
    deposit,
    isDepositing,
    createProposal,
    isCreatingProposal,
    vote,
    isVoting,
    executeProposal,
    isExecuting,
    releaseMilestone,
    isReleasingMilestone,
  } = useTreasury();

  const { isConnected, openWalletModal } = useWalletStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  // Modal states
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [depositAmount, setDepositAmount] = useState("");
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDesc, setProposalDesc] = useState("");
  const [proposalRecipient, setProposalRecipient] = useState("");
  const [proposalAmount, setProposalAmount] = useState("");
  const [milestoneCount, setMilestoneCount] = useState<number>(4);

  // Status Filter
  const [statusFilter, setStatusFilter] = useState<ProposalStatus | "ALL">("ALL");

  const filteredProposals = proposals.filter((p) => {
    if (statusFilter === "ALL") return true;
    return p.status === statusFilter;
  });

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;
    try {
      await deposit(amt);
      setDepositAmount("");
      setIsDepositOpen(false);
    } catch {}
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(proposalAmount);
    if (!proposalTitle || !proposalDesc || !proposalRecipient || isNaN(amt) || amt <= 0) return;
    try {
      await createProposal({
        title: proposalTitle,
        description: proposalDesc,
        recipient: proposalRecipient,
        amount: amt,
        milestoneCount,
      });
      setProposalTitle("");
      setProposalDesc("");
      setProposalRecipient("");
      setProposalAmount("");
      setMilestoneCount(4);
      setIsCreateOpen(false);
    } catch {}
  };

  const checkAuthAndRun = (action: () => void) => {
    if (!isConnected) openWalletModal();
    else if (!isAuthenticated) openAuthModal();
    else action();
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <Vault className="h-6 w-6 text-blue-400" /> Community Treasury Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deposit XLM, propose milestone-escrow grants, vote on proposals, and release milestone tranches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => checkAuthAndRun(() => setIsDepositOpen(true))}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md"
          >
            <Coins className="h-4 w-4 text-cyan-400" /> Deposit XLM
          </button>

          <button
            onClick={() => checkAuthAndRun(() => setIsCreateOpen(true))}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
          >
            <PlusCircle className="h-4 w-4" /> Create Proposal
          </button>
        </div>
      </div>

      {/* Treasury Vault Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Vault Total Balance</span>
          <p className="text-2xl font-black text-cyan-400 font-mono">
            {isLoadingStats ? "..." : formatXLM(stats?.totalBalance || 45000)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Grants Proposed</span>
          <p className="text-2xl font-black text-slate-100 font-mono">
            {isLoadingStats ? "..." : `${stats?.totalProposals || 4} Proposals`}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Escrow Disbursed</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {isLoadingStats ? "..." : formatXLM(25000)}
          </p>
        </div>
      </div>

      {/* Filter Tabs Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
        <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-indigo-400" /> Community Proposals
        </h2>

        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          {(["ALL", "Active", "Executed", "Rejected"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === filter
                  ? "bg-slate-800 text-blue-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals List Grid */}
      {isLoadingProposals ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProposalSkeleton />
          <ProposalSkeleton />
        </div>
      ) : filteredProposals.length === 0 ? (
        <EmptyState
          title="No Proposals Found"
          description="There are currently no community proposals matching the selected filter status."
          actionText="Create Proposal"
          onAction={() => checkAuthAndRun(() => setIsCreateOpen(true))}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProposals.map((proposal) => {
            const totalVotes = proposal.votesYes + proposal.votesNo;
            const yesPercent = totalVotes > 0 ? Math.round((proposal.votesYes / totalVotes) * 100) : 50;

            const mCount = proposal.milestoneCount || 4;
            const mClaimed = proposal.milestonesClaimed || (proposal.status === "Executed" ? 1 : 0);
            const mAmount = proposal.milestoneAmount || proposal.amount / mCount;
            const hasMilestonesToRelease = proposal.status === "Executed" && mClaimed < mCount;

            return (
              <div
                key={proposal.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between gap-6 hover:border-slate-700/80 transition-all shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-slate-400 font-medium">
                      Proposal #{proposal.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        proposal.status === "Active"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : proposal.status === "Executed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {proposal.status === "Active" && <Clock className="h-3 w-3" />}
                      {proposal.status === "Executed" && <CheckCircle2 className="h-3 w-3" />}
                      {proposal.status === "Rejected" && <XCircle className="h-3 w-3" />}
                      {proposal.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 leading-snug">{proposal.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{proposal.description}</p>

                  {/* Milestone Escrow Status Indicator */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300 flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-indigo-400" /> Milestone Escrow Tranches
                      </span>
                      <span className="font-mono text-cyan-400">
                        {mClaimed} of {mCount} Released
                      </span>
                    </div>

                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                      <div
                        className="bg-indigo-500 transition-all duration-500"
                        style={{ width: `${(mClaimed / mCount) * 100}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-0.5">
                      <span>Total: {formatXLM(proposal.amount)}</span>
                      <span>Tranche: {formatXLM(mAmount)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Requested Grant</span>
                      <span className="font-mono font-bold text-cyan-400">{formatXLM(proposal.amount)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Recipient Address</span>
                      <span className="font-mono text-slate-300">{formatAddress(proposal.recipient, 4)}</span>
                    </div>
                  </div>
                </div>

                {/* Voting Bar & Actions */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-emerald-400">YES: {proposal.votesYes.toLocaleString()} ({yesPercent}%)</span>
                      <span className="text-red-400">NO: {proposal.votesNo.toLocaleString()} ({100 - yesPercent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden flex">
                      <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${yesPercent}%` }} />
                      <div className="bg-red-500 transition-all duration-500" style={{ width: `${100 - yesPercent}%` }} />
                    </div>
                  </div>

                  {/* Actions */}
                  {proposal.status === "Active" ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => checkAuthAndRun(() => vote({ proposalId: proposal.id, approve: true }))}
                        disabled={isVoting}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" /> Vote YES
                      </button>

                      <button
                        onClick={() => checkAuthAndRun(() => vote({ proposalId: proposal.id, approve: false }))}
                        disabled={isVoting}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        <ThumbsDown className="h-3.5 w-3.5" /> Vote NO
                      </button>

                      <button
                        onClick={() => checkAuthAndRun(() => executeProposal(proposal.id))}
                        disabled={isExecuting}
                        className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-md disabled:opacity-50"
                        title="Execute Passed Proposal"
                      >
                        <Play className="h-3.5 w-3.5" /> Execute
                      </button>
                    </div>
                  ) : hasMilestonesToRelease ? (
                    <button
                      onClick={() => checkAuthAndRun(() => releaseMilestone(proposal.id))}
                      disabled={isReleasingMilestone}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all disabled:opacity-50"
                    >
                      {isReleasingMilestone ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Layers className="h-4 w-4" /> Release Next Milestone Tranche ({formatXLM(mAmount)})
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="p-2.5 bg-slate-950 rounded-xl text-center text-xs text-slate-400 font-mono">
                      Governance Voting Concluded • Proposal {proposal.status} ({mClaimed}/{mCount} Disbursed)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deposit XLM Modal */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Coins className="h-5 w-5 text-cyan-400" /> Deposit into Treasury Vault
              </h3>
              <button onClick={() => setIsDepositOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Deposit Amount (XLM)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Depositing XLM mints proportional voting power in all community grant proposals.</span>
              </div>

              <button
                type="submit"
                disabled={isDepositing}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl text-xs transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDepositing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm Soroban Deposit"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Proposal Modal with Milestone Escrow Selector */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-blue-400" /> Create Milestone-Escrow Proposal
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Proposal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Developer Grant for Soroban Indexer"
                  value={proposalTitle}
                  onChange={(e) => setProposalTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the grant objectives, milestone deliverables, and budget breakdown..."
                  value={proposalDesc}
                  onChange={(e) => setProposalDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs text-slate-300 font-medium">Grant (XLM)</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={proposalAmount}
                    onChange={(e) => setProposalAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono text-slate-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs text-slate-300 font-medium">Milestones</label>
                  <select
                    value={milestoneCount}
                    onChange={(e) => setMilestoneCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value={1}>1 Lump-Sum</option>
                    <option value={2}>2 Tranches</option>
                    <option value={3}>3 Tranches</option>
                    <option value={4}>4 Tranches</option>
                    <option value={5}>5 Tranches</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs text-slate-300 font-medium">Recipient</label>
                  <input
                    type="text"
                    placeholder="G..."
                    value={proposalRecipient}
                    onChange={(e) => setProposalRecipient(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm font-mono text-slate-100 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingProposal}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl text-xs transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isCreatingProposal ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Milestone Proposal to Contract"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
