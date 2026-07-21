export const STELLAR_CONFIG = {
  network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet",
  rpcUrl: process.env.NEXT_PUBLIC_STELLAR_RPC_URL || "https://soroban-testnet.stellar.org",
  networkPassphrase:
    process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE ||
    "Test SDF Network ; September 2015",
  explorerUrl:
    process.env.NEXT_PUBLIC_STELLAR_EXPLORER_URL ||
    "https://stellar.expert/explorer/testnet",
  contractId:
    process.env.NEXT_PUBLIC_CONTRACT_ID ||
    "CB67890TREASURYCONTRACTIDSTELLARTESTNETDAPPDEMO",
};

export const SUPPORTED_WALLETS = [
  {
    id: "freighter",
    name: "Freighter Wallet",
    icon: "🚀",
    description: "Official browser extension wallet by SDF",
    installed: true,
  },
  {
    id: "albedo",
    name: "Albedo Wallet",
    icon: "⚡",
    description: "Web-based secure Stellar key management",
    installed: true,
  },
  {
    id: "xbull",
    name: "xBull Wallet",
    icon: "🐂",
    description: "Feature-packed multi-platform wallet",
    installed: true,
  },
  {
    id: "rabet",
    name: "Rabet Wallet",
    icon: "🐰",
    description: "Lightweight extension wallet for Stellar",
    installed: true,
  },
  {
    id: "lobstr",
    name: "Lobstr Mobile",
    icon: "🦞",
    description: "Popular mobile and desktop wallet",
    installed: true,
  },
  {
    id: "demo",
    name: "Stellar Testnet Keypair (Demo)",
    icon: "🔑",
    description: "Instant testnet keypair with auto Friendbot funding",
    installed: true,
  },
];
