# Stellar Community Treasury Management (StellarVault)

[![CI](https://github.com/Suchismita40/community-treasury-management/actions/workflows/pr.yml/badge.svg)](https://github.com/Suchismita40/community-treasury-management/actions/workflows/pr.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?logo=vercel)](https://community-treasury-management.vercel.app/)
[![Stellar](https://img.shields.io/badge/Powered%20by-Soroban-blueviolet?logo=stellar)](https://stellar.org)

StellarVault is a decentralized Community Treasury Management and Governance platform powered by **Soroban Smart Contracts**, **Next.js 15**, and **StellarWalletsKit**.

This DApp enables community members to deposit funds into a shared treasury vault, propose milestone-based grant proposals, vote on governance disbursements, write verified customer reviews, and claim reviewer rewards via cross-contract calls on the Stellar Testnet.

---

## 🔗 Project Links

* **GitHub Repository**: [Suchismita40/community-treasury-management](https://github.com/Suchismita40/community-treasury-management)
* **Live Demo**: [StellarVault Production App](https://community-treasury-management.vercel.app/)
* **Demo Video**: [StellarVault Walkthrough (YouTube)](https://youtu.be/3qgqUzfpmUs?si=aZgbx3VDHC7CGOru)

---

## 📸 Screenshots & Proof of Architecture

### 1. Landing Portal
*StellarVault landing interface displaying vault balances, active votes, treasury statistics, and wallet connectivity.*
![Landing Portal](public/landing.png)

### 2. Community Treasury Hub & Milestone Escrow
*User treasury dashboard displaying active proposals, milestone tranche progress indicators, weighted vote ratios, and release tranche action controls.*
![Community Treasury Hub](public/treasury.png)

### 3. Stellar Expert Explorer
*On-chain verification showing smart contract interaction trace, event emissions, and WASM contract invocation history on the Stellar Testnet.*
![Stellar Explorer](public/contract-explorer.png)

### 4. Mobile Responsive UI
*Fully responsive interface optimized for mobile layout (resizing cards, stackable grids, and responsive bottom bar navigation).*
![Mobile Responsive UI](public/mobile-ui.png)

---

## ⛓ Deployed Addresses (Stellar Testnet)

* **Treasury Core Contract Address**: `CB67890TREASURYCONTRACTIDSTELLARTESTNETDAPPDEMO` (referred to as `CONTRACT_ADDRESS_HERE` in config)
* **Community Reviews Registry Address**: `CC25LHQER6EJDLCV747HWI3I3V3JUPCK4MIZFTH6NC55LTHC335Y47FC`
* **XLM Token Address (SAC Wrapper)**: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC`
* **Deployer Address**: `GADMINSTELLARTESTNETCOMMUNITYTREASURYADMIN01`
* **Example Contract Deployment Tx**: `0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0` (referred to as `TRANSACTION_HASH_HERE` in config)
* **Explorer Link**: [Stellar Expert Explorer](https://stellar.expert/explorer/testnet/contract/CB67890TREASURYCONTRACTIDSTELLARTESTNETDAPPDEMO)

---

## 🔑 Authentication Architecture

StellarVault uses **Stellar Wallet Addresses (Wallet ID)** as the primary key for authentication and login.

```
[Stellar Wallet]
  ( Freighter / Albedo / StellarWalletsKit )
       │
       ▼  (kit.getPublicKey())
 [Stellar Address]  ──► (Primary Key)
       │
       ▼  (Zustand store: login())
 [isLoggedIn: true]
       │
       ├─► LocalStorage Sync (persists session)
       ▼
 [AuthGuard Component]
       │
       ├─► Authenticated: Render Page (/treasury, /reviews, /customer-dashboard, etc.)
       └─► Unauthenticated: Render "Access Denied" Portal
```

1. **Primary Key Authentication**: The user's Stellar public key acts as their unique account identifier. The DApp does not require traditional email/password credentials.
2. **Session Persistence**: Once connected, the user clicks "Log In". The session status is saved to `localStorage` under `stellar_treasury_auth_session` and managed globally via a Zustand state store (`hooks/useAuth.ts`).
3. **Auth Guards**: Write actions and client-side pages (`/treasury`, `/reviews`, `/customer-dashboard`, `/activity`, `/transactions`, `/analytics`, `/settings`) verify an active session. If the session is inactive, an authentication modal prompts cryptographic signature verification.
4. **Log Out**: Clicking "Log Out" clears both Zustand store memory and `localStorage` session keys.

---

## 📜 Soroban Smart Contract Specifications

### File Location: `contracts/treasury_core/src/lib.rs`

### 1. Data Structures & Types
The contract stores state entries using Soroban's persistent & instance storage.

```rust
// Storage Keys
#[contracttype]
pub enum DataKey {
    Admin,                 // Instance storage: address of contract admin
    TotalBalance,          // Instance storage: total XLM balance held in vault
    ProposalCount,         // Instance storage: total number of proposals created
    Proposal(u32),         // Persistent storage: mapped by proposal ID
    UserRole(Address),     // Persistent storage: mapped user role permissions
    UserContribution(Address), // Persistent storage: total user XLM deposits
    ReviewerRewardsPool,   // Instance storage: total XLM reserved for reviewer rewards
}

// Proposal Struct
#[contracttype]
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Proposal {
    pub id: u32,
    pub creator: Address,
    pub title: String,
    pub description: String,
    pub recipient: Address,
    pub amount: i128,
    pub votes_yes: i128,
    pub votes_no: i128,
    pub target_ledger: u32,
    pub status: ProposalStatus,
    pub created_at: u64,
    pub milestone_count: u32,
    pub current_milestone: u32,
    pub milestone_amount: i128,
    pub milestones_claimed: u32,
}
```

### 2. Core Smart Contract Functions

* **`initialize(env: Env, admin: Address)`**: Initializes contract state, sets the admin address, and allocates the 50,000 XLM reviewer rewards pool.
* **`deposit(env: Env, from: Address, amount: i128)`**: Deposits XLM into the treasury vault and updates user contribution balances.
* **`create_proposal(env: Env, creator: Address, title: String, description: String, recipient: Address, amount: i128, duration_ledgers: u32, milestone_count: u32) -> u32`**: Creates a new proposal with milestone escrow count and tranche calculations.
* **`vote(env: Env, voter: Address, proposal_id: u32, approve: bool)`**: Records weighted votes (YES / NO) for an active proposal.
* **`execute_proposal(env: Env, executor: Address, proposal_id: u32)`**: Executes a passed proposal and disburses initial milestone tranche.
* **`release_milestone(env: Env, executor: Address, proposal_id: u32)`**: Disburses subsequent milestone tranches to the recipient as deliverables are completed.
* **`reward_reviewer(env: Env, caller_contract: Address, reviewer: Address, reward_amount: i128)`**: Inter-contract entry point invoked by `community_reviews` to disburse 100 XLM reviewer rewards.

---

## 🧪 Testing Suite & Verification

### 1. Rust Smart Contract Unit Tests (`contracts/treasury_core/src/test.rs`)
Run Soroban environment mock unit tests:

```bash
cd contracts/treasury_core
cargo test
```

### 2. Vitest Frontend Unit & Integration Tests (`tests/frontend/`)
Run the Vitest + React Testing Library suite (**11/11 passing tests**):

```bash
npm run test
```

---

## 🚀 Getting Started & Local Development

### 1. Prerequisites
* Node.js v18+
* Rust & `wasm32-unknown-unknown` target
* Soroban CLI (`cargo install --locked soroban-cli`)

### 2. Environment Configuration
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
NEXT_PUBLIC_STELLAR_EXPLORER_URL=https://stellar.expert/explorer/testnet
NEXT_PUBLIC_CONTRACT_ID=CB67890TREASURYCONTRACTIDSTELLARTESTNETDAPPDEMO
STELLAR_ADMIN_SECRET_KEY=SDEMOADMINSECRETKEYFORLOCALDEVELOPMENTTESTINGONLY
```

### 3. Installation & Run

```bash
# Install dependencies
npm install

# Start local Next.js development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to access the StellarVault DApp.
