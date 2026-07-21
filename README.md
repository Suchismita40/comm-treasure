# Community Treasury Management & Governance Platform

A production-grade decentralized **Community Treasury Management & Governance Platform** built on the Stellar blockchain with Soroban smart contracts. It features dual smart contracts with **Inter-Contract Communication**, milestone-based grant escrow disbursal, wallet-based cryptographic authentication, personal customer dashboards, real-time ledger event streaming, a smart **Transaction Retry Mechanism**, Vitest & Rust test suites, and GitHub Actions CI/CD pipelines.

---

## 📐 Architecture Diagram

```mermaid
graph TD
    User([User / Web Browser]) --> WalletKit[StellarWalletsKit Adapter]
    WalletKit --> AuthService[StellarAuthService: Challenge Signing & Session JWT]
    AuthService --> NextApp[Next.js 15 Frontend Hub]
    
    subgraph Frontend Layer
        NextApp --> TreasuryPage[Treasury Hub /treasury]
        NextApp --> CustomerDash[My Customer Dashboard /customer-dashboard]
        NextApp --> ReviewsPage[Customer Reviews /reviews]
        NextApp --> AnalyticsPage[Analytics Engine /analytics]
        NextApp --> ActivityPage[Real-Time Activity Feed /activity]
        NextApp --> TxPage[Transaction History /transactions]
        NextApp --> SettingsPage[Settings /settings]
    end

    subgraph Transaction Management Layer
        NextApp --> TxStore[TransactionStore: Retry System & Max 3 Retries]
        TxStore --> SimulationEngine[Soroban RPC Re-simulation Engine]
    end

    subgraph Blockchain & Soroban Layer
        SimulationEngine --> RPCClient[Soroban RPC Client]
        RPCClient -->|Contract Call A| CoreContract[Treasury Core Contract: contracts/treasury_core]
        RPCClient -->|Contract Call B| ReviewsContract[Community Reviews Contract: contracts/community_reviews]
        ReviewsContract -->|Inter-Contract Call: reward_reviewer| CoreContract
        CoreContract -->|Emits Events| StellarLedger[(Stellar Testnet Ledger)]
        ReviewsContract -->|Emits Events| StellarLedger
    end

    StellarLedger -->|Event Polling / Streaming| ActivityPage
```

---

## 🌟 Key Features Implemented

### 1. Milestone-Based Grant Escrow Disbursal
- **Tranche Release Protocol**: Grants are structured into 1 to 5 milestone tranches (e.g. 4 milestones of 2,500 XLM for a 10,000 XLM proposal).
- **Progress Tracking & Controls**: Treasury proposals display milestone progress indicators and "Release Next Milestone" action triggers.
- **Soroban Smart Contract**: `release_milestone(env, executor, proposal_id)` method disburses individual milestone tranches to grant recipients as deliverables are completed.

### 2. Wallet-Based Authentication & Personal Customer Dashboard (`/customer-dashboard`)
- **Cryptographic Challenge Authentication**: Users sign a unique nonce challenge via StellarWalletsKit to prove public key ownership (no separate passwords).
- **Session Persistence**: Secure session tokens stored in local storage and refreshed on reconnect.
- **My Customer Dashboard**: Personal portal tracking user's deposits, proposals created, votes cast, customer reviews submitted, reviewer rewards earned, and editable off-chain profile.
- **Action Gating**: Write operations require an active authenticated session; read access remains fully public.

### 3. Smart Transaction Retry System
- **Automatic Simulation Re-Run**: Re-simulates Soroban RPC invocation before resubmitting failed transactions (handling sequence errors, network hiccups, or fee estimates).
- **Retry Count Management**: Tracks `retryCount` up to a maximum cap of **3 attempts** per transaction.
- **Failure Transparency**: Surfacing human-readable failure reasons in both floating toasts and the `/transactions` ledger center.

---

## 🧪 Running Tests

### Frontend Unit & Integration Tests (Vitest)

```bash
npm run test
```

### Soroban Smart Contract Tests (Rust)

```bash
cd contracts/treasury_core
cargo test

cd ../community_reviews
cargo test
```

---

## ⚙️ Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_STELLAR_EXPLORER_URL=https://stellar.expert/explorer/testnet
NEXT_PUBLIC_CONTRACT_ID=CB67890TREASURYCONTRACTIDSTELLARTESTNETDAPPDEMO
STELLAR_ADMIN_SECRET_KEY=SDEMOADMINSECRETKEYFORLOCALDEVELOPMENTTESTINGONLY
```

---

## 📌 Contract Addresses & Links

- **Treasury Core Contract**: `CONTRACT_ADDRESS_PLACEHOLDER`
- **Example Transaction Hash**: `TRANSACTION_HASH_PLACEHOLDER`
- **Demo Video**: `DEMO_VIDEO_LINK_PLACEHOLDER`
- **Live Demo App**: `LIVE_DEMO_PLACEHOLDER`
