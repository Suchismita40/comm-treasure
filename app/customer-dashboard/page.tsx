"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTreasury } from "../../hooks/useTreasury";
import { useReviews } from "../../hooks/useReviews";
import { useWalletStore } from "../../lib/store/useWalletStore";
import { formatAddress, formatXLM, formatTimestamp } from "../../lib/utils";
import {
  User,
  ShieldCheck,
  Coins,
  Vote,
  MessageSquare,
  Award,
  Edit,
  Save,
  CheckCircle2,
  Lock,
  Wallet,
  Clock,
  Star,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const { isAuthenticated, profile, updateProfile, openAuthModal } = useAuth();
  const { proposals } = useTreasury();
  const { reviews } = useReviews();
  const { isConnected, address, openWalletModal, xlmBalance } = useWalletStore();

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [avatar, setAvatar] = useState(profile?.avatar || "🛡️");
  const [notifPref, setNotifPref] = useState(profile?.notificationPreference || "all");
  const [saved, setSaved] = useState(false);

  const userProposals = proposals.filter((p) => address && p.creator.toLowerCase() === address.toLowerCase());
  const userReviews = reviews.filter((r) => address && r.reviewer.toLowerCase() === address.toLowerCase());

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      avatar,
      notificationPreference: notifPref as any,
    });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!isConnected || !address) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-slate-400 mx-auto border border-slate-800">
          <Wallet className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Connect Wallet Required</h2>
        <p className="text-xs text-slate-400">
          Please connect your Stellar wallet to access your personal customer dashboard and view on-chain activity.
        </p>
        <button
          onClick={openWalletModal}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-500/20"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mx-auto border border-indigo-500/20">
          <Lock className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">Wallet Authentication Required</h2>
        <p className="text-xs text-slate-400">
          Sign the cryptographic login challenge to verify key ownership and unlock your personal customer dashboard.
        </p>
        <button
          onClick={openAuthModal}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-500/20"
        >
          Sign Challenge & Authenticate
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Profile Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <span className="text-4xl p-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-md">
            {profile?.avatar || "🛡️"}
          </span>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-100">{profile?.displayName}</h1>
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                <CheckCircle2 className="h-3 w-3" /> Authenticated Key
              </span>
            </div>
            <p className="font-mono text-xs text-slate-400">{formatAddress(address, 10)}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setDisplayName(profile?.displayName || "");
            setAvatar(profile?.avatar || "🛡️");
            setNotifPref(profile?.notificationPreference || "all");
            setIsEditing(true);
          }}
          className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
        >
          <Edit className="h-3.5 w-3.5" /> Edit Off-Chain Profile
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Off-chain profile updated successfully!
        </div>
      )}

      {/* On-Chain Customer Activity Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>My XLM Balance</span>
            <Coins className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-xl font-black text-cyan-400 font-mono">{formatXLM(xlmBalance)}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Proposals Submitted</span>
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-xl font-black text-slate-100 font-mono">{userProposals.length} Submitted</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Reviews Written</span>
            <MessageSquare className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-xl font-black text-blue-400 font-mono">{userReviews.length} Reviews</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Review Rewards Earned</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xl font-black text-emerald-400 font-mono">
            {userReviews.filter((r) => r.rewardClaimed).length * 100} XLM
          </p>
        </div>
      </div>

      {/* Customer Proposals & Reviews Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Proposals */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="h-5 w-5 text-indigo-400" /> My Submitted Proposals
          </h3>

          {userProposals.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              You haven't submitted any community proposals yet.
            </p>
          ) : (
            <div className="space-y-3">
              {userProposals.map((p) => (
                <div key={p.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-slate-200">{p.title}</span>
                    <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-blue-400 font-mono">
                      {p.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Target: {formatXLM(p.amount)}</span>
                    <span>Created: {formatTimestamp(p.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Reviews */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <MessageSquare className="h-5 w-5 text-blue-400" /> My Customer Reviews
          </h3>

          {userReviews.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              You haven't submitted any feedback reviews yet.
            </p>
          ) : (
            <div className="space-y-3">
              {userReviews.map((r) => (
                <div key={r.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-xs text-slate-200">{r.proposalTitle}</span>
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "fill-amber-400" : "text-slate-800"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2">{r.feedback}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="h-5 w-5 text-indigo-400" /> Edit Customer Profile
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Avatar Emoji Icon</label>
                <div className="flex gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 justify-center">
                  {["🛡️", "🚀", "⚡", "🦁", "💎", "🌐"].map((e) => (
                    <button
                      type="button"
                      key={e}
                      onClick={() => setAvatar(e)}
                      className={`text-2xl p-2 rounded-xl border transition-all ${
                        avatar === e ? "bg-indigo-500/20 border-indigo-500" : "border-transparent opacity-60"
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Notification Preferences</label>
                <select
                  value={notifPref}
                  onChange={(e) => setNotifPref(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Events (Deposits, Proposals, Votes, Reviews)</option>
                  <option value="governance_only">Governance Proposals Only</option>
                  <option value="rewards_only">Reviewer Rewards Only</option>
                  <option value="none">Mute Notifications</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
