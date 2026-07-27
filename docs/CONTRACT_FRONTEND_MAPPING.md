# Contract ↔ Frontend Function Traceability Matrix

This document provides a mandatory 1:1 mapping between Soroban Rust Smart Contract entry points, client wrappers, custom React hooks, UI components, frontend pages, and user actions for the **Stellar Community Treasury Management (StellarVault)** application.

---

## 🏛 1. Treasury Core Contract (`contracts/treasury_core/src/lib.rs`)

### 1.1 `initialize(env: Env, admin: Address)`
* **Source File**: [`contracts/treasury_core/src/lib.rs`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/contracts/treasury_core/src/lib.rs#L69)
* **Contract Client**: [`lib/contracts/treasury-client.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/lib/contracts/treasury-client.ts) ➔ `TreasuryContractClient.initialize(admin)`
* **Hook**: [`hooks/useTreasury.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/hooks/useTreasury.ts)
* **React Component**: Admin Setup Banner / Script Trigger
* **Page**: [`app/treasury/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/treasury/page.tsx)
* **User Action**: Contract administrator initializes contract state and sets the 50,000 XLM reviewer rewards pool.

### 1.2 `deposit(env: Env, from: Address, amount: i128)`
* **Source File**: [`contracts/treasury_core/src/lib.rs`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/contracts/treasury_core/src/lib.rs#L82)
* **Contract Client**: [`lib/contracts/treasury-client.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/lib/contracts/treasury-client.ts) ➔ `TreasuryContractClient.deposit(fromAddress, amount)`
* **Hook**: [`hooks/useTreasury.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/hooks/useTreasury.ts) ➔ `deposit(amount)`
* **React Component**: `DepositModal`
* **Page**: [`app/treasury/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/treasury/page.tsx)
* **User Action**: Community member clicks **"Deposit XLM"**, inputs XLM deposit amount, signs wallet signature, and mints proportional voting power.

### 1.3 `create_proposal(env: Env, creator: Address, title: String, description: String, recipient: Address, amount: i128, duration_ledgers: u32, milestone_count: u32) -> u32`
* **Source File**: [`contracts/treasury_core/src/lib.rs`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/contracts/treasury_core/src/lib.rs#L121)
* **Contract Client**: [`lib/contracts/treasury-client.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/lib/contracts/treasury-client.ts) ➔ `TreasuryContractClient.create_proposal(creator, title, description, recipient, amount, milestoneCount, durationLedgers)`
* **Hook**: [`hooks/useTreasury.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/hooks/useTreasury.ts) ➔ `createProposal(data)`
* **React Component**: `CreateProposalModal`
* **Page**: [`app/treasury/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/treasury/page.tsx)
* **User Action**: User clicks **"Create Proposal"**, enters grant title, description, recipient address, requested XLM amount, and selects 1 to 5 milestone tranches.

### 1.4 `vote(env: Env, voter: Address, proposal_id: u32, approve: bool)`
* **Source File**: [`contracts/treasury_core/src/lib.rs`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/contracts/treasury_core/src/lib.rs#L169)
* **Contract Client**: [`lib/contracts/treasury-client.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/lib/contracts/treasury-client.ts) ➔ `TreasuryContractClient.vote(voter, proposalId, approve)`
* **Hook**: [`hooks/useTreasury.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/hooks/useTreasury.ts) ➔ `vote({ proposalId, approve })`
* **React Component**: Proposal Card Action Buttons (`Vote YES` / `Vote NO`)
* **Page**: [`app/treasury/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/treasury/page.tsx)
* **User Action**: Voter casts a weighted YES or NO vote on an active governance proposal.

### 1.5 `execute_proposal(env: Env, executor: Address, proposal_id: u32)`
* **Source File**: [`contracts/treasury_core/src/lib.rs`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/contracts/treasury_core/src/lib.rs#L191)
* **Contract Client**: [`lib/contracts/treasury-client.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/lib/contracts/treasury-client.ts) ➔ `TreasuryContractClient.execute_proposal(executor, proposalId)`
* **Hook**: [`hooks/useTreasury.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/hooks/useTreasury.ts) ➔ `executeProposal(proposalId)`
* **React Component**: Proposal Card Action Button (`Execute Proposal`)
* **Page**: [`app/treasury/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/treasury/page.tsx)
* **User Action**: User executes a passed proposal, transitioning status to `Executed` and disbursing Milestone Tranche #1.

### 1.6 `release_milestone(env: Env, executor: Address, proposal_id: u32)`
* **Source File**: [`contracts/treasury_core/src/lib.rs`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/contracts/treasury_core/src/lib.rs#L213)
* **Contract Client**: [`lib/contracts/treasury-client.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/lib/contracts/treasury-client.ts) ➔ `TreasuryContractClient.release_milestone(executor, proposalId)`
* **Hook**: [`hooks/useTreasury.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/hooks/useTreasury.ts) ➔ `releaseMilestone(proposalId)`
* **React Component**: Proposal Milestone Controls (`Release Next Milestone Tranche`)
* **Page**: [`app/treasury/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/treasury/page.tsx)
* **User Action**: Executor releases subsequent milestone funding tranches to the recipient upon deliverable completion.

### 1.7 `reward_reviewer(env: Env, caller_contract: Address, reviewer: Address, reward_amount: i128)`
* **Source File**: [`contracts/treasury_core/src/lib.rs`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/contracts/treasury_core/src/lib.rs#L100)
* **Contract Client**: [`lib/contracts/treasury-client.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/lib/contracts/treasury-client.ts) ➔ `TreasuryContractClient.reward_reviewer(callerContract, reviewer, rewardAmount)`
* **Hook**: [`hooks/useReviews.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/hooks/useReviews.ts) (Internal Inter-Contract Trigger)
* **React Component**: Review Reward Button (`Claim 100 XLM Reward`)
* **Page**: [`app/reviews/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/reviews/page.tsx)
* **User Action**: Inter-contract invocation: `CommunityReviews` contract invokes `TreasuryCore.reward_reviewer` to disburse 100 XLM from the reviewer rewards pool.

### 1.8 `get_state(env: Env) -> TreasuryState`
* **Source File**: [`contracts/treasury_core/src/lib.rs`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/contracts/treasury_core/src/lib.rs#L237)
* **Contract Client**: [`lib/contracts/treasury-client.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/lib/contracts/treasury-client.ts) ➔ `TreasuryContractClient.get_state()`
* **Hook**: [`hooks/useTreasury.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/hooks/useTreasury.ts) ➔ `stats`
* **React Component**: Stats Cards & Overview Widgets
* **Page**: [`app/treasury/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/treasury/page.tsx) & [`app/customer-dashboard/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/customer-dashboard/page.tsx)
* **User Action**: Fetches current vault balance, total proposals created, active proposal count, and reviewer reward pool balance.

---

## 🌟 2. Community Reviews Contract (`contracts/community_reviews/src/lib.rs`)

### 2.1 `submit_review(env: Env, reviewer: Address, proposal_id: u32, rating: u32, feedback: String) -> u32`
* **Source File**: [`contracts/community_reviews/src/lib.rs`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/contracts/community_reviews/src/lib.rs#L31)
* **Contract Client**: [`lib/contracts/review-client.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/lib/contracts/review-client.ts) ➔ `ReviewContractClient.submit_review(reviewer, proposalId, proposalTitle, rating, feedback)`
* **Hook**: [`hooks/useReviews.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/hooks/useReviews.ts) ➔ `submitReview(data)`
* **React Component**: `WriteReviewModal`
* **Page**: [`app/reviews/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/reviews/page.tsx)
* **User Action**: Community member clicks **"Write Review"**, rates an executed proposal (1-5 stars), submits feedback text, and registers the review on-chain.

### 2.2 `claim_reviewer_reward(env: Env, reviewer: Address, review_id: u32, treasury_core_contract: Address)`
* **Source File**: [`contracts/community_reviews/src/lib.rs`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/contracts/community_reviews/src/lib.rs#L70)
* **Contract Client**: [`lib/contracts/review-client.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/lib/contracts/review-client.ts) ➔ `ReviewContractClient.claim_reviewer_reward(reviewer, reviewId, treasuryCoreContract)`
* **Hook**: [`hooks/useReviews.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/hooks/useReviews.ts) ➔ `claimReward(reviewId)`
* **React Component**: Review Item Reward Control (`Claim Reward`)
* **Page**: [`app/reviews/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/reviews/page.tsx) & [`app/customer-dashboard/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/customer-dashboard/page.tsx)
* **User Action**: Reviewer clicks **"Claim Reward"**, initiating the inter-contract call from `CommunityReviewsContract` to `TreasuryCoreContract` to receive 100 XLM.

### 2.3 `get_review(env: Env, review_id: u32) -> Review`
* **Source File**: [`contracts/community_reviews/src/lib.rs`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/contracts/community_reviews/src/lib.rs#L117)
* **Contract Client**: [`lib/contracts/review-client.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/lib/contracts/review-client.ts) ➔ `ReviewContractClient.get_review(reviewId)`
* **Hook**: [`hooks/useReviews.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/hooks/useReviews.ts)
* **React Component**: Single Review View / Modal Details
* **Page**: [`app/reviews/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/reviews/page.tsx)
* **User Action**: Fetches a single review's rating, feedback, and claim status by ID.

### 2.4 `list_reviews(env: Env, limit: u32) -> Vec<Review>`
* **Source File**: [`contracts/community_reviews/src/lib.rs`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/contracts/community_reviews/src/lib.rs#L125)
* **Contract Client**: [`lib/contracts/review-client.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/lib/contracts/review-client.ts) ➔ `ReviewContractClient.list_reviews(limit)`
* **Hook**: [`hooks/useReviews.ts`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/hooks/useReviews.ts) ➔ `reviews`
* **React Component**: Review Cards Grid & Rating Breakdown Chart
* **Page**: [`app/reviews/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/reviews/page.tsx) & [`app/customer-dashboard/page.tsx`](file:///c:/Users/user/OneDrive/Desktop/COMM%20TREASURE/app/customer-dashboard/page.tsx)
* **User Action**: Renders the complete feed of verified proposal reviews and star ratings.

---

## 🔗 Traceability Flow Diagram

```
┌───────────────────────────┐     ┌──────────────────────────┐     ┌──────────────────────────┐
│  Soroban Contract (lib.rs) │ ──► │  Client (lib/contracts/)  │ ──► │ Hook (hooks/useTreasury) │
└───────────────────────────┘     └──────────────────────────┘     └────────────┬─────────────┘
                                                                                │
                                                                                ▼
┌───────────────────────────┐     ┌──────────────────────────┐     ┌──────────────────────────┐
│  User Wallet Action (Sig) │ ◄── │  React Page (app/treasury)│ ◄── │  Modal / Card Component  │
└───────────────────────────┘     └──────────────────────────┘     └──────────────────────────┘
```
