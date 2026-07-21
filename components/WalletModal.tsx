"use client";

import { useWalletStore } from "../lib/store/useWalletStore";
import { StellarWalletManager } from "../lib/stellar/wallet-kit";
import { formatAddress } from "../lib/utils";
import { X, Wallet, CheckCircle2, AlertTriangle, ExternalLink, LogOut } from "lucide-react";

export function WalletModal() {
  const {
    isModalOpen,
    isConnected,
    address,
    selectedWallet,
    isConnecting,
    error,
    closeWalletModal,
    connectWallet,
    disconnectWallet,
  } = useWalletStore();

  const supportedWallets = StellarWalletManager.getSupportedWallets();

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {isConnected ? "Connected Wallet" : "Select Stellar Wallet"}
              </h3>
              <p className="text-xs text-slate-400">
                {isConnected ? "StellarWalletsKit Active Session" : "StellarWalletsKit Multi-Wallet Integration"}
              </p>
            </div>
          </div>

          <button
            onClick={closeWalletModal}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl flex items-start gap-2 animate-in slide-in-from-top-1">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">Wallet Error</span>
              <p className="text-[11px] text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Connected State */}
        {isConnected && address ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Public Address</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> Connected ({selectedWallet})
                </span>
              </div>
              <p className="font-mono text-sm text-slate-100 font-semibold break-all">{address}</p>
            </div>

            <button
              onClick={() => disconnectWallet()}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold py-3 rounded-xl text-xs transition-all"
            >
              <LogOut className="h-4 w-4" /> Disconnect Wallet
            </button>
          </div>
        ) : (
          /* Supported Wallets List */
          <div className="space-y-2.5">
            {supportedWallets.map((w) => (
              <button
                key={w.id}
                onClick={() => connectWallet(w.id as any)}
                disabled={isConnecting}
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700 transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl p-2 bg-slate-900 rounded-lg border border-slate-800">
                    {w.icon}
                  </span>
                  <div className="text-left">
                    <span className="font-bold text-xs text-slate-200 group-hover:text-blue-400 transition-colors">
                      {w.name}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      {w.isInstalled ? "Extension Ready" : "Browser Wallet / Web"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium group-hover:text-slate-200">
                  <span>Connect</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
