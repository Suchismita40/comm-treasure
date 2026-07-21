"use client";

import { X, Wallet, CheckCircle, AlertTriangle, ExternalLink, RefreshCw, LogOut, Copy, Check } from "lucide-react";
import { useWalletStore } from "../lib/store/useWalletStore";
import { SUPPORTED_WALLETS, STELLAR_CONFIG } from "../lib/config";
import { formatAddress, formatXLM } from "../lib/utils";
import { useState } from "react";

export function WalletModal() {
  const {
    isModalOpen,
    closeWalletModal,
    isConnected,
    address,
    selectedWallet,
    xlmBalance,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    clearError,
  } = useWalletStore();

  const [copied, setCopied] = useState(false);

  if (!isModalOpen) return null;

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-blue-500/10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-bold text-slate-100">
              {isConnected ? "Wallet Connected" : "Connect Stellar Wallet"}
            </h3>
          </div>
          <button
            onClick={closeWalletModal}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-200">Wallet Connection Notice</p>
              <p className="mt-0.5 opacity-90">{error}</p>
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-200">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Connected Wallet View */}
        {isConnected ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Provider</span>
                <span className="font-semibold capitalize text-blue-400 flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-400" /> {selectedWallet}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400">Stellar Address</span>
                <div className="flex items-center justify-between bg-slate-900 rounded-lg p-2.5 border border-slate-800">
                  <span className="font-mono text-xs text-slate-200">{formatAddress(address, 8)}</span>
                  <button
                    onClick={handleCopyAddress}
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title="Copy full address"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                <span className="text-slate-400">Testnet XLM Balance</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-cyan-400 text-sm">{formatXLM(xlmBalance)}</span>
                  <button
                    onClick={refreshBalance}
                    className="text-slate-400 hover:text-white transition-colors p-1"
                    title="Refresh Balance"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={`${STELLAR_CONFIG.explorerUrl}/account/${address}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
              >
                View on Explorer <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <button
                onClick={disconnectWallet}
                className="flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
              >
                <LogOut className="h-3.5 w-3.5" /> Disconnect
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Wallet Selection Modal Options */
          <div className="mt-4 space-y-2 max-h-[380px] overflow-y-auto pr-1">
            <p className="text-xs text-slate-400 mb-3">
              Select your preferred Stellar wallet provider or testnet keypair to interact with the Soroban Treasury.
            </p>

            {SUPPORTED_WALLETS.map((w) => (
              <button
                key={w.id}
                disabled={isConnecting}
                onClick={() => connectWallet(w.id)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-blue-500/40 text-left transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-1 bg-slate-900 rounded-lg border border-slate-800">{w.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {w.name}
                      </span>
                      {w.id === "demo" && (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-semibold">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{w.description}</p>
                  </div>
                </div>
                {isConnecting && selectedWallet === w.id ? (
                  <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />
                ) : (
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200">Connect →</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
