"use client";

import { useTransactionStore } from "../../lib/store/useTransactionStore";
import { STELLAR_CONFIG } from "../../lib/config";
import { formatAddress, formatTimestamp } from "../../lib/utils";
import { History, ExternalLink, CheckCircle2, XCircle, Loader2, ArrowUpRight, Search, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function TransactionsPage() {
  const { transactions, retryTransaction } = useTransactionStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const filteredTx = transactions.filter((tx) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      tx.hash.toLowerCase().includes(q) ||
      tx.functionName.toLowerCase().includes(q) ||
      tx.status.toLowerCase().includes(q)
    );
  });

  const handleRetry = async (id: string) => {
    setRetryingId(id);
    try {
      await retryTransaction(id);
    } catch {} finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <History className="h-6 w-6 text-indigo-400" /> Transaction Ledger History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete transaction tracking history with automated Soroban RPC simulation retry support.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by hash or method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Transaction Table / List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Contract Function</th>
                <th className="px-6 py-4">Transaction Hash</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Actions & Explorer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTx.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No transactions match your search filter.
                  </td>
                </tr>
              ) : (
                filteredTx.map((tx) => {
                  const isRetrying = retryingId === tx.id;
                  const canRetry = tx.status === "Failed" && (tx.canRetry ?? true) && (tx.retryCount || 0) < (tx.maxRetries || 3);

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${
                              tx.status === "Pending"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : tx.status === "Success"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                            }`}
                          >
                            {tx.status === "Pending" && <Loader2 className="h-3 w-3 animate-spin" />}
                            {tx.status === "Success" && <CheckCircle2 className="h-3 w-3" />}
                            {tx.status === "Failed" && <XCircle className="h-3 w-3" />}
                            {tx.status}
                          </span>
                          {tx.retryCount && tx.retryCount > 0 ? (
                            <span className="text-[10px] text-slate-400 font-mono">
                              Retries: {tx.retryCount}/{tx.maxRetries || 3}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                        {tx.functionName}
                        {tx.params && (
                          <span className="block text-[10px] font-normal text-slate-400">
                            {JSON.stringify(tx.params).replace(/[{}\"]/g, "")}
                          </span>
                        )}
                        {tx.errorMessage && (
                          <span className="block text-[10px] text-red-400 mt-0.5 line-clamp-1">
                            {tx.errorMessage}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 font-mono text-slate-300">
                        {formatAddress(tx.hash, 8)}
                      </td>

                      <td className="px-6 py-4 font-mono text-slate-400">
                        {formatTimestamp(tx.timestamp)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {canRetry && (
                            <button
                              onClick={() => handleRetry(tx.id)}
                              disabled={isRetrying}
                              className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all disabled:opacity-50"
                            >
                              <RefreshCw className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`} />
                              Retry ({(tx.retryCount || 0) + 1}/3)
                            </button>
                          )}

                          <a
                            href={tx.explorerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold hover:underline"
                          >
                            Stellar Expert <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
