"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, ShieldCheck, Activity, History, Vault, MessageSquare, BarChart3, Settings, User, Lock, KeyRound } from "lucide-react";
import { useWalletStore } from "../lib/store/useWalletStore";
import { useAuthStore } from "../lib/store/useAuthStore";
import { formatAddress, formatXLM } from "../lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { isConnected, address, xlmBalance, openWalletModal } = useWalletStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const navItems = [
    { label: "Overview", href: "/", icon: Vault },
    { label: "Treasury Hub", href: "/treasury", icon: ShieldCheck },
    { label: "Reviews", href: "/reviews", icon: MessageSquare },
    { label: "Activity", href: "/activity", icon: Activity },
    { label: "Transactions", href: "/transactions", icon: History },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
    { label: "My Dashboard", href: "/customer-dashboard", icon: User },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all">
            <Vault className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight">StellarVault</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Community Treasury Vault</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/60">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action / Auth & Wallet Connect */}
        <div className="flex items-center gap-2.5">
          {isConnected && (
            <button
              onClick={openAuthModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isAuthenticated
                  ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
                  : "bg-amber-500/10 text-amber-300 border-amber-500/30 animate-pulse"
              }`}
              title={isAuthenticated ? "Authenticated Session Active" : "Click to Sign Login Challenge"}
            >
              {isAuthenticated ? <KeyRound className="h-3.5 w-3.5 text-emerald-400" /> : <Lock className="h-3.5 w-3.5" />}
              {isAuthenticated ? "Session Active" : "Login"}
            </button>
          )}

          {isConnected ? (
            <button
              onClick={openWalletModal}
              className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shadow-md group"
            >
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-cyan-400 font-semibold">{formatXLM(xlmBalance)}</span>
              </div>
              <div className="h-4 w-px bg-slate-800" />
              <span className="font-mono font-medium group-hover:text-blue-400 transition-colors">
                {formatAddress(address)}
              </span>
            </button>
          ) : (
            <button
              onClick={openWalletModal}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
