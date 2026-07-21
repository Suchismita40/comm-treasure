# Changelog

All notable changes to the **Stellar Community Treasury Management (StellarVault)** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.0.0] - 2026-07-22 - Stellar Level 3 Release

### Added
- **Milestone-Based Grant Escrow Disbursal**:
  - Soroban smart contract support for 1 to 5 milestone tranches (`create_proposal` & `release_milestone`).
  - Progress bar indicators and tranche release action buttons on proposal cards.
  - Real-time `MilestoneReleased` activity feed events.

- **Wallet-Based Cryptographic Authentication**:
  - Nonce challenge message generation and wallet signature verification (`StellarAuthService`).
  - 7-day session token persistence in `localStorage`.
  - Action-gating (`requireAuth`) for all contract write mutations (`deposit`, `create_proposal`, `vote`, `execute_proposal`, `submit_review`, `claim_reward`).

- **Personal Customer Dashboard (`/customer-dashboard`)**:
  - User-centric portal listing user XLM balance, submitted proposals, reviews written, reviewer rewards claimed, and off-chain profile editing.

- **Smart Transaction Retry System**:
  - Automatic Soroban RPC simulation re-run before resubmitting failed transactions.
  - Enforced 3-attempt retry cap per transaction.
  - Clear error reason tooltips in `TransactionTracker` toast and `/transactions` ledger center.

- **Responsive Mobile UI**:
  - Slide-over mobile navigation drawer with hamburger menu button (`Navbar.tsx`).
  - Sticky bottom mobile navigation bar (`MobileBottomNav.tsx`).
  - Stackable responsive card grids for phone viewports.

- **Testing Suite**:
  - 11/11 passing Vitest + React Testing Library unit tests.
  - Rust `cargo test` unit tests for Soroban contract access control and state transitions.

- **CI/CD & Documentation**:
  - GitHub Actions PR linting & testing workflow (`pr.yml`).
  - Production deployment pipeline (`deploy.yml`).
  - Complete Level 3 `README.md` with Mermaid architecture and sequence diagrams.
