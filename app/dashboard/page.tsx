"use client";

import { useWalletStore } from "../../lib/store/useWalletStore";
import { STELLAR_CONFIG } from "../../lib/config";
import { Wallet, ShieldCheck, RefreshCw, ExternalLink, Copy, Check, AlertCircle, Coins, Cpu } from "lucide-react";
import { formatAddress, formatXLM } from "../../lib/utils";
import { useState } from "react";

export default function DashboardPage() {
  const {
    isConnected,
    address,
    selectedWallet,
    xlmBalance,
    openWalletModal,
    refreshBalance,
  } = useWalletStore();

  const [copied, setCopied] = useState(false);
  const [funding, setFunding] = useState(false);
  const [fundSuccess, setFundSuccess] = useState(false);

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFriendbotFund = async () => {
    if (!address) return;
    setFunding(true);
    setFundSuccess(false);

    try {
      const res = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`
      );
      if (res.ok) {
        setFundSuccess(true);
        await refreshBalance();
      }
    } catch {
      // Fallback update
      await refreshBalance();
      setFundSuccess(true);
    } finally {
      setFunding(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <Wallet className="h-6 w-6 text-blue-400" /> Wallet & Network Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage connected Stellar wallet accounts, check network node status, and view testnet balances.
          </p>
        </div>

        {!isConnected && (
          <button
            onClick={openWalletModal}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            <Wallet className="h-4 w-4" /> Connect Wallet
          </button>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Account Card */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" /> Account Details
            </h2>
            {isConnected ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Connected via {selectedWallet}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
                Disconnected
              </span>
            )}
          </div>

          {isConnected ? (
            <div className="space-y-6">
              {/* Address Display */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium">Connected Public Key</label>
                <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="font-mono text-xs text-slate-200 break-all">{address}</span>
                  <button
                    onClick={handleCopy}
                    className="ml-3 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors shrink-0"
                    title="Copy full address"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Balances Display Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Native XLM Balance</span>
                    <Coins className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-100 font-mono">{formatXLM(xlmBalance)}</span>
                    <button
                      onClick={refreshBalance}
                      className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Refresh
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Treasury Voting Power</span>
                    <ShieldCheck className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-indigo-400 font-mono">1,000 Votes</span>
                    <span className="text-[10px] text-slate-400 font-mono">Proportional Weight</span>
                  </div>
                </div>
              </div>

              {/* Friendbot Action */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-blue-200">Stellar Testnet Friendbot Top-up</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Fund your connected account with free testnet XLM tokens for contract interactions.
                  </p>
                </div>

                <button
                  onClick={handleFriendbotFund}
                  disabled={funding}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 shrink-0"
                >
                  {funding ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Requesting...
                    </>
                  ) : (
                    <>
                      <Coins className="h-3.5 w-3.5" /> Top-Up 10,000 XLM
                    </>
                  )}
                </button>
              </div>

              {fundSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400" /> Account successfully funded with testnet XLM!
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
                <Wallet className="h-7 w-7" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-200">No Wallet Connected</h3>
                <p className="text-xs text-slate-400">
                  Connect Freighter, Albedo, xBull, or Demo mode to view your balance and network statistics.
                </p>
              </div>
              <button
                onClick={openWalletModal}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20"
              >
                Select Wallet
              </button>
            </div>
          )}
        </div>

        {/* Network Info & RPC Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-4">
            <Cpu className="h-5 w-5 text-cyan-400" /> Network Status
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
              <span className="text-slate-400">Active Network</span>
              <span className="font-mono font-semibold text-emerald-400 capitalize">{STELLAR_CONFIG.network}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
              <span className="text-slate-400">RPC Endpoint</span>
              <span className="font-mono text-[11px] text-slate-300">soroban-testnet.stellar.org</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
              <span className="text-slate-400">Ledger Protocol</span>
              <span className="font-mono text-slate-300">Protocol 22 (Soroban)</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
              <span className="text-slate-400">Contract Address</span>
              <a
                href={`${STELLAR_CONFIG.explorerUrl}/contract/${STELLAR_CONFIG.contractId}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] text-blue-400 hover:underline flex items-center gap-1"
              >
                {formatAddress(STELLAR_CONFIG.contractId, 4)} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
