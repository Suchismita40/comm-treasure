"use client";

import { useAuth } from "../hooks/useAuth";
import { useWalletStore } from "../lib/store/useWalletStore";
import { ShieldCheck, Lock, X, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { formatAddress } from "../lib/utils";

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, challenge, isLoggingIn, login } = useAuth();
  const { address, selectedWallet } = useWalletStore();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">Wallet Authentication</h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl space-y-1">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="h-4 w-4 text-cyan-400" /> Sign Challenge Message
            </div>
            <p className="text-[11px] text-slate-300">
              Sign a cryptographic challenge via your connected wallet ({selectedWallet || "Stellar Wallet"}) to establish a secure authenticated session.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-slate-400 font-medium">Public Key / Wallet Account</span>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-slate-200 text-xs">
              {formatAddress(address, 8)}
            </div>
          </div>

          {challenge && (
            <div className="space-y-1.5">
              <span className="text-slate-400 font-medium">Challenge Nonce Payload</span>
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[10px] text-slate-400 break-all">
                Nonce: {challenge.nonce}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => login()}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl text-xs shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Verifying Signature...
            </>
          ) : (
            <>
              <KeyRound className="h-4 w-4" /> Sign Message & Login
            </>
          )}
        </button>
      </div>
    </div>
  );
}
