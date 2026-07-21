"use client";

import { useTransactionStore } from "../lib/store/useTransactionStore";
import { Loader2, CheckCircle2, XCircle, ExternalLink, X, RefreshCw } from "lucide-react";
import { formatAddress } from "../lib/utils";
import { useState } from "react";

export function TransactionTracker() {
  const { activePendingTx, retryTransaction, clearActiveTx } = useTransactionStore();
  const [isRetrying, setIsRetrying] = useState(false);

  if (!activePendingTx) return null;

  const isPending = activePendingTx.status === "Pending";
  const isSuccess = activePendingTx.status === "Success";
  const isFailed = activePendingTx.status === "Failed";
  const canRetry = isFailed && (activePendingTx.canRetry ?? true) && (activePendingTx.retryCount || 0) < (activePendingTx.maxRetries || 3);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await retryTransaction(activePendingTx.id);
    } catch {} finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`rounded-2xl border p-4 shadow-2xl backdrop-blur-md transition-all ${
          isPending
            ? "border-amber-500/40 bg-amber-950/90 text-amber-100 shadow-amber-500/10"
            : isSuccess
            ? "border-emerald-500/40 bg-emerald-950/90 text-emerald-100 shadow-emerald-500/10"
            : "border-red-500/40 bg-red-950/90 text-red-100 shadow-red-500/10"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {isPending && <Loader2 className="h-5 w-5 text-amber-400 animate-spin shrink-0" />}
            {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
            {isFailed && <XCircle className="h-5 w-5 text-red-400 shrink-0" />}

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm capitalize">
                  Transaction {activePendingTx.status}
                </span>
                <span className="rounded bg-black/30 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wide">
                  {activePendingTx.functionName}
                </span>
              </div>
              <p className="text-xs opacity-80 mt-0.5">
                {isPending && "Broadcasting transaction to Stellar Testnet RPC..."}
                {isSuccess && "Soroban state updated successfully!"}
                {isFailed && (activePendingTx.errorMessage || "Transaction execution failed on chain.")}
              </p>
            </div>
          </div>

          <button
            onClick={clearActiveTx}
            className="rounded-lg p-1 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Transaction Hash & Retry Action */}
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 text-xs">
          <span className="font-mono text-[11px] opacity-75">
            Hash: {formatAddress(activePendingTx.hash, 6)}
          </span>

          <div className="flex items-center gap-3">
            {canRetry && (
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/30 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${isRetrying ? "animate-spin" : ""}`} />
                Retry ({(activePendingTx.retryCount || 0) + 1}/3)
              </button>
            )}

            <a
              href={activePendingTx.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 font-semibold underline underline-offset-2 hover:opacity-100 transition-opacity"
            >
              Stellar Expert <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
