import Link from "next/link";
import { STELLAR_CONFIG } from "../lib/config";
import { ExternalLink, Shield, Cpu, Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/60 py-8 mt-auto text-slate-400 text-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="font-semibold text-slate-200">Community Treasury Management</span>
            <span className="text-slate-600">|</span>
            <span>Soroban Smart Contract</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              RPC Node Online
            </div>

            <a
              href={`${STELLAR_CONFIG.explorerUrl}/contract/${STELLAR_CONFIG.contractId}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-blue-400 transition-colors"
            >
              Contract Explorer <ExternalLink className="h-3 w-3" />
            </a>

            <a
              href="https://developers.stellar.org"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
            >
              Stellar Docs <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>© 2026 Community Treasury Management. Built for Stellar Level 2 Certification.</p>
          <div className="flex gap-4 mt-2 sm:mt-0 font-mono">
            <span>Network: {STELLAR_CONFIG.network}</span>
            <span>Contract ID: {STELLAR_CONFIG.contractId.substring(0, 10)}...</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
