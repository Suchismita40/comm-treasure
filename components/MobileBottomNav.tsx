"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, MessageSquare, User, History, Activity } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const mobileNavItems = [
    { label: "Treasury", href: "/treasury", icon: ShieldCheck },
    { label: "Reviews", href: "/reviews", icon: MessageSquare },
    { label: "Dashboard", href: "/customer-dashboard", icon: User },
    { label: "Activity", href: "/activity", icon: Activity },
    { label: "Transactions", href: "/transactions", icon: History },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 shadow-2xl"
    >
      <div className="flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isActive
                  ? "text-blue-400 bg-blue-500/10 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
