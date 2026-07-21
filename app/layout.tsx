import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { WalletModal } from "../components/WalletModal";
import { AuthModal } from "../components/AuthModal";
import { TransactionTracker } from "../components/TransactionTracker";

export const metadata: Metadata = {
  title: "Community Treasury Management | Soroban Treasury Vault",
  description:
    "Decentralized Community Treasury Management DApp built on Stellar & Soroban smart contracts. Proposal voting, grant disbursement, multi-wallet integration, and real-time ledger events.",
  keywords: [
    "Stellar",
    "Soroban",
    "Smart Contracts",
    "Treasury Management",
    "DAO",
    "StellarWalletsKit",
    "Testnet",
    "XLM",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <Footer />
          <WalletModal />
          <AuthModal />
          <TransactionTracker />
        </Providers>
      </body>
    </html>
  );
}
