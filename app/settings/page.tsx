"use client";

import { useState } from "react";
import { Settings, Shield, Cpu, Bell, Check, Save } from "lucide-react";
import { STELLAR_CONFIG } from "../../lib/config";

export default function SettingsPage() {
  const [selectedNetwork, setSelectedNetwork] = useState(STELLAR_CONFIG.network);
  const [rpcUrl, setRpcUrl] = useState(STELLAR_CONFIG.rpcUrl);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 py-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-slate-400" /> Settings & DApp Preferences
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure Stellar network nodes, RPC endpoints, session persistence, and real-time event notifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Network & RPC Node Configuration */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="h-5 w-5 text-cyan-400" /> Stellar Network & RPC Endpoint
          </h2>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Stellar Target Network</label>
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="testnet">Stellar Testnet (soroban-testnet.stellar.org)</option>
                <option value="futurenet">Stellar Futurenet (rpc-futurenet.stellar.org)</option>
                <option value="mainnet" disabled>
                  Stellar Mainnet (Coming Soon)
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Soroban RPC URL</label>
              <input
                type="text"
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Real-time Events & Session Preferences */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bell className="h-5 w-5 text-indigo-400" /> Event Synchronization & Alerts
          </h2>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="font-semibold text-slate-200 block">Real-time Soroban Event Polling</span>
                <span className="text-slate-400 text-[11px]">
                  Automatically poll for contract events every 4 seconds without page reload.
                </span>
              </div>

              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 rounded border-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
              <div>
                <span className="font-semibold text-slate-200 block">Transaction Toast Alerts</span>
                <span className="text-slate-400 text-[11px]">
                  Display floating transaction tracker toasts for Pending, Success, and Failed contract calls.
                </span>
              </div>

              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-4 w-4 rounded border-slate-800 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Save Button & Feedback */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
          >
            <Save className="h-4 w-4" /> Save Preferences
          </button>

          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <Check className="h-4 w-4 text-emerald-400" /> Preferences Saved!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
