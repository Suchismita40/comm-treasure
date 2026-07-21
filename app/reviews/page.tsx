"use client";

import { useState } from "react";
import { useReviews } from "../../hooks/useReviews";
import { useTreasury } from "../../hooks/useTreasury";
import { useWalletStore } from "../../lib/store/useWalletStore";
import { formatAddress, formatTimestamp } from "../../lib/utils";
import {
  MessageSquare,
  Star,
  PlusCircle,
  Gift,
  CheckCircle2,
  ExternalLink,
  X,
  Loader2,
  Coins,
  ShieldCheck,
} from "lucide-react";

export default function ReviewsPage() {
  const { reviews, isLoadingReviews, submitReview, isSubmittingReview, claimReward, isClaimingReward } =
    useReviews();
  const { proposals } = useTreasury();
  const { isConnected, address, openWalletModal } = useWalletStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState<number>(1);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback || !selectedProposalId) return;

    const prop = proposals.find((p) => p.id === selectedProposalId);
    const title = prop ? prop.title : `Proposal #${selectedProposalId}`;

    try {
      await submitReview({
        proposalId: selectedProposalId,
        proposalTitle: title,
        rating,
        feedback,
      });
      setFeedback("");
      setIsModalOpen(false);
    } catch {}
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <MessageSquare className="h-6 w-6 text-indigo-400" /> Community Reviews & Ratings Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Read project feedback, rate completed grant proposals, and trigger inter-contract reviewer rewards.
          </p>
        </div>

        <button
          onClick={() => {
            if (!isConnected) openWalletModal();
            else setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105"
        >
          <PlusCircle className="h-4 w-4" /> Write Review
        </button>
      </div>

      {/* Inter-Contract Banner */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950 p-6 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
          <ShieldCheck className="h-4 w-4 text-cyan-400" /> Inter-Contract Communication Architecture
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Submitting a review interacts with the <strong>Community Reviews Contract</strong> (`contracts/community_reviews`).
          When claiming a review reward, the Secondary Contract performs a cross-contract invocation calling `treasury_core.reward_reviewer` to disburse 100 XLM from the Treasury Core Vault directly into your wallet.
        </p>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoadingReviews ? (
          <div className="py-12 text-center text-slate-400 text-xs animate-pulse">
            Loading community reviews from Soroban Secondary Contract...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
            No customer reviews submitted yet. Be the first to review a community proposal!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700/80 transition-all shadow-md"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-700"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="font-mono text-xs font-semibold text-slate-200">
                    {rev.proposalTitle}
                  </span>

                  <span className="text-[11px] bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-800 text-slate-400 font-mono">
                    Review #{rev.id}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-normal">{rev.feedback}</p>

                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                  <span>Reviewer: {formatAddress(rev.reviewer, 6)}</span>
                  <span>•</span>
                  <span>{formatTimestamp(rev.createdAt)}</span>
                </div>
              </div>

              {/* Inter-Contract Claim Reward Button */}
              <div className="shrink-0 flex flex-col items-end gap-2 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
                <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                  <Coins className="h-4 w-4 text-cyan-400" /> Reward: {rev.rewardAmount} XLM
                </div>

                {rev.rewardClaimed ? (
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Reward Claimed
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      if (!isConnected) openWalletModal();
                      else claimReward(rev.id);
                    }}
                    disabled={isClaimingReward}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-all disabled:opacity-50"
                  >
                    {isClaimingReward ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <Gift className="h-3.5 w-3.5" /> Claim Reward (Inter-Contract)
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-indigo-400" /> Submit Customer Review
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Select Grant Proposal</label>
                <select
                  value={selectedProposalId}
                  onChange={(e) => setSelectedProposalId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {proposals.map((p) => (
                    <option key={p.id} value={p.id}>
                      Proposal #{p.id}: {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Rating (1 to 5 Stars)</label>
                <div className="flex gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Detailed Feedback</label>
                <textarea
                  rows={3}
                  placeholder="Provide constructive feedback on project execution, code quality, and delivery..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold py-3 rounded-xl text-xs transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmittingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Review to Secondary Contract"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
