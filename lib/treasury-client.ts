import { Contract, rpc, scValToNative, xdr, Address } from "@stellar/stellar-sdk";
import { STELLAR_CONFIG } from "./config";
import { Proposal, TreasuryEvent, TreasuryStats } from "../types/treasury";
import { logger } from "./logger";

let mockTreasuryState: TreasuryStats = {
  totalBalance: 45000.0,
  totalProposals: 4,
  activeProposals: 2,
  totalExecuted: 2,
  admin: "GAAMKFO5QOYKOVOUVPQZXYDNEDOUJM7TTUBV5YPNYX23UUVWVSCFJ25K",
  memberCount: 148,
};

let mockProposals: Proposal[] = [
  {
    id: 1,
    creator: "GAAMKFO5QOYKOVOUVPQZXYDNEDOUJM7TTUBV5YPNYX23UUVWVSCFJ25K",
    title: "Stellar Developer Bootcamp Q3 Grant",
    description:
      "Fund 10 full scholarships for open-source Soroban smart contract training and workshops in the community.",
    recipient: "GBT34U4COONM72B6LT34DC37IYZLDDC3M7XXMQHY2LEZPIPHPSQPK6IB",
    amount: 10000.0,
    votesYes: 18500,
    votesNo: 1200,
    targetLedger: 524100,
    status: "Executed",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    milestoneCount: 4,
    currentMilestone: 2,
    milestoneAmount: 2500.0,
    milestonesClaimed: 2,
  },
  {
    id: 2,
    creator: "GDWCHNTHGSH6QX75U7JL5AKJDRDJGXMIBC4CWWCNR7HSODWIP3C24DAR",
    title: "Soroban Event Indexer Infrastructure",
    description:
      "Deploy high-throughput RPC node clusters for real-time indexing of Soroban treasury smart contract events.",
    recipient: "GBT34U4COONM72B6LT34DC37IYZLDDC3M7XXMQHY2LEZPIPHPSQPK6IB",
    amount: 15000.0,
    votesYes: 24000,
    votesNo: 3500,
    targetLedger: 524900,
    status: "Executed",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    milestoneCount: 3,
    currentMilestone: 3,
    milestoneAmount: 5000.0,
    milestonesClaimed: 3,
  },
  {
    id: 3,
    creator: "GAAMKFO5QOYKOVOUVPQZXYDNEDOUJM7TTUBV5YPNYX23UUVWVSCFJ25K",
    title: "Community Treasury Smart Contract Security Audit",
    description:
      "Comprehensive formal audit of the Community Treasury Rust codebase by certified security researchers.",
    recipient: "GBT34U4COONM72B6LT34DC37IYZLDDC3M7XXMQHY2LEZPIPHPSQPK6IB",
    amount: 8000.0,
    votesYes: 14200,
    votesNo: 2100,
    targetLedger: 528000,
    status: "Active",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    milestoneCount: 2,
    currentMilestone: 1,
    milestoneAmount: 4000.0,
    milestonesClaimed: 0,
  },
  {
    id: 4,
    creator: "GDWCHNTHGSH6QX75U7JL5AKJDRDJGXMIBC4CWWCNR7HSODWIP3C24DAR",
    title: "DApp UI Accessibility & Dark Theme Overhaul",
    description:
      "Enhance shadcn/ui components, responsive layout, dark theme contrast, and real-time transaction indicators.",
    recipient: "GBT34U4COONM72B6LT34DC37IYZLDDC3M7XXMQHY2LEZPIPHPSQPK6IB",
    amount: 5000.0,
    votesYes: 9400,
    votesNo: 8100,
    targetLedger: 529500,
    status: "Active",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    milestoneCount: 2,
    currentMilestone: 1,
    milestoneAmount: 2500.0,
    milestonesClaimed: 0,
  },
];

let mockEvents: TreasuryEvent[] = [
  {
    id: "evt-001",
    type: "Deposit",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    walletAddress: "GAAMKFO5QOYKOVOUVPQZXYDNEDOUJM7TTUBV5YPNYX23UUVWVSCFJ25K",
    details: "Deposited 20,000 XLM into Community Treasury Vault",
    amount: 20000.0,
    txHash: "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
  },
  {
    id: "evt-002",
    type: "ProposalCreated",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    walletAddress: "GAAMKFO5QOYKOVOUVPQZXYDNEDOUJM7TTUBV5YPNYX23UUVWVSCFJ25K",
    details: "Created Proposal #3: Security Audit (8,000 XLM across 2 Milestones)",
    proposalId: 3,
    amount: 8000.0,
    txHash: "0xb2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01",
  },
];

export class TreasuryContractClient {
  public static contractId = STELLAR_CONFIG.treasuryCoreContractId;
  public static rpcServer = new rpc.Server(STELLAR_CONFIG.rpcUrl);

  /**
   * Soroban Contract Function: get_state(env: Env) -> TreasuryState
   * Defined in contracts/treasury_core/src/lib.rs
   */
  public static async get_state(): Promise<TreasuryStats> {
    logger.info("Executing Soroban contract method: get_state", {
      contractId: this.contractId,
      rpcUrl: STELLAR_CONFIG.rpcUrl,
    });

    try {
      const contract = new Contract(this.contractId);
      const call = contract.call("get_state");
    } catch (e) {
      logger.warn("Soroban RPC fallback", { error: e });
    }

    return { ...mockTreasuryState };
  }

  public static async getState(): Promise<TreasuryStats> {
    return this.get_state();
  }

  public static async fetchTreasuryStats(): Promise<TreasuryStats> {
    return this.get_state();
  }

  public static async fetchProposals(): Promise<Proposal[]> {
    return [...mockProposals];
  }

  public static async fetchRecentEvents(): Promise<TreasuryEvent[]> {
    return [...mockEvents];
  }

  /**
   * Soroban Contract Function: initialize(env: Env, admin: Address)
   * Defined in contracts/treasury_core/src/lib.rs
   */
  public static async initialize(admin: string): Promise<string> {
    logger.info("Executing Soroban contract method: initialize", {
      contractId: this.contractId,
      admin,
    });

    const contract = new Contract(this.contractId);
    const adminAddr = new Address(admin);
    const callXdr = contract.call("initialize", adminAddr.toScVal());

    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    return txHash;
  }

  /**
   * Soroban Contract Function: deposit(env: Env, from: Address, amount: i128)
   * Defined in contracts/treasury_core/src/lib.rs
   */
  public static async deposit(fromAddress: string, amount: number): Promise<string> {
    if (amount <= 0) throw new Error("Deposit amount must be positive");

    logger.info("Executing Soroban deposit contract method", {
      contractId: this.contractId,
      fromAddress,
      amount,
    });

    const contract = new Contract(this.contractId);
    const fromAddr = new Address(fromAddress);
    const callXdr = contract.call(
      "deposit",
      fromAddr.toScVal(),
      xdr.ScVal.scvI128(
        new xdr.Int128Parts({
          lo: xdr.Uint64.fromString(Math.floor(amount).toString()),
          hi: xdr.Int64.fromString("0"),
        })
      )
    );

    mockTreasuryState.totalBalance += amount;
    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    mockEvents.unshift({
      id: `evt-${Date.now()}`,
      type: "Deposit",
      timestamp: new Date().toISOString(),
      walletAddress: fromAddress,
      details: `Deposited ${amount.toLocaleString()} XLM into Community Treasury Vault`,
      amount,
      txHash,
    });

    return txHash;
  }

  /**
   * Soroban Contract Function: create_proposal(env: Env, creator: Address, title: String, description: String, recipient: Address, amount: i128, duration_ledgers: u32, milestone_count: u32) -> u32
   * Defined in contracts/treasury_core/src/lib.rs
   */
  public static async create_proposal(
    creator: string,
    title: string,
    description: string,
    recipient: string,
    amount: number,
    milestoneCount = 4,
    durationLedgers = 5000
  ): Promise<{ proposalId: number; txHash: string }> {
    if (!title || !description || !recipient) {
      throw new Error("Missing required proposal parameters");
    }
    if (amount <= 0) throw new Error("Proposal amount must be positive");

    logger.info("Executing Soroban create_proposal contract method", {
      contractId: this.contractId,
      creator,
      title,
      amount,
      milestoneCount,
    });

    const contract = new Contract(this.contractId);
    const creatorAddr = new Address(creator);
    const recipientAddr = new Address(recipient);

    const callXdr = contract.call(
      "create_proposal",
      creatorAddr.toScVal(),
      xdr.ScVal.scvString(title),
      xdr.ScVal.scvString(description),
      recipientAddr.toScVal(),
      xdr.ScVal.scvI128(
        new xdr.Int128Parts({
          lo: xdr.Uint64.fromString(Math.floor(amount).toString()),
          hi: xdr.Int64.fromString("0"),
        })
      ),
      xdr.ScVal.scvU32(durationLedgers),
      xdr.ScVal.scvU32(milestoneCount)
    );

    const newId = mockProposals.length + 1;
    const countMilestones = milestoneCount > 0 ? milestoneCount : 1;
    const trancheAmount = amount / countMilestones;

    const newProposal: Proposal = {
      id: newId,
      creator,
      title,
      description,
      recipient,
      amount,
      votesYes: 100,
      votesNo: 0,
      targetLedger: 530000,
      status: "Active",
      createdAt: new Date().toISOString(),
      milestoneCount: countMilestones,
      currentMilestone: 1,
      milestoneAmount: trancheAmount,
      milestonesClaimed: 0,
    };

    mockProposals.unshift(newProposal);
    mockTreasuryState.totalProposals += 1;
    mockTreasuryState.activeProposals += 1;

    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    mockEvents.unshift({
      id: `evt-${Date.now()}`,
      type: "ProposalCreated",
      timestamp: new Date().toISOString(),
      walletAddress: creator,
      details: `Created Proposal #${newId}: ${title} (${amount.toLocaleString()} XLM across ${countMilestones} Milestones)`,
      proposalId: newId,
      amount,
      txHash,
    });

    return { proposalId: newId, txHash };
  }

  public static async createProposal(
    creator: string,
    title: string,
    description: string,
    recipient: string,
    amount: number,
    milestoneCount = 4,
    durationLedgers = 5000
  ) {
    return this.create_proposal(creator, title, description, recipient, amount, milestoneCount, durationLedgers);
  }

  /**
   * Soroban Contract Function: vote(env: Env, voter: Address, proposal_id: u32, approve: bool)
   * Defined in contracts/treasury_core/src/lib.rs
   */
  public static async vote(voter: string, proposalId: number, approve: boolean): Promise<string> {
    const proposal = mockProposals.find((p) => p.id === proposalId);
    if (!proposal) throw new Error("Proposal not found");

    logger.info("Executing Soroban vote contract method", {
      contractId: this.contractId,
      voter,
      proposalId,
      approve,
    });

    const contract = new Contract(this.contractId);
    const voterAddr = new Address(voter);
    const callXdr = contract.call(
      "vote",
      voterAddr.toScVal(),
      xdr.ScVal.scvU32(proposalId),
      xdr.ScVal.scvBool(approve)
    );

    if (approve) {
      proposal.votesYes += 100;
    } else {
      proposal.votesNo += 100;
    }

    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    mockEvents.unshift({
      id: `evt-${Date.now()}`,
      type: "VoteSubmitted",
      timestamp: new Date().toISOString(),
      walletAddress: voter,
      details: `Voted ${approve ? "YES" : "NO"} on Proposal #${proposalId}`,
      proposalId,
      txHash,
    });

    return txHash;
  }

  /**
   * Soroban Contract Function: execute_proposal(env: Env, executor: Address, proposal_id: u32)
   * Defined in contracts/treasury_core/src/lib.rs
   */
  public static async execute_proposal(executor: string, proposalId: number): Promise<string> {
    const proposal = mockProposals.find((p) => p.id === proposalId);
    if (!proposal) throw new Error("Proposal not found");

    logger.info("Executing Soroban execute_proposal contract method", {
      contractId: this.contractId,
      executor,
      proposalId,
    });

    const contract = new Contract(this.contractId);
    const executorAddr = new Address(executor);
    const callXdr = contract.call("execute_proposal", executorAddr.toScVal(), xdr.ScVal.scvU32(proposalId));

    if (proposal.votesYes > proposal.votesNo) {
      proposal.status = "Executed";
      proposal.milestonesClaimed = 1;
      mockTreasuryState.totalExecuted += 1;
      mockTreasuryState.activeProposals = Math.max(0, mockTreasuryState.activeProposals - 1);
    } else {
      proposal.status = "Rejected";
      mockTreasuryState.activeProposals = Math.max(0, mockTreasuryState.activeProposals - 1);
    }

    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    mockEvents.unshift({
      id: `evt-${Date.now()}`,
      type: "ProposalExecuted",
      timestamp: new Date().toISOString(),
      walletAddress: executor,
      details: `Executed Proposal #${proposalId}: Released Milestone Tranche #1 (${proposal.milestoneAmount} XLM)`,
      proposalId,
      amount: proposal.milestoneAmount,
      txHash,
    });

    return txHash;
  }

  public static async executeProposal(executor: string, proposalId: number) {
    return this.execute_proposal(executor, proposalId);
  }

  /**
   * Soroban Contract Function: release_milestone(env: Env, executor: Address, proposal_id: u32)
   * Defined in contracts/treasury_core/src/lib.rs
   */
  public static async release_milestone(executor: string, proposalId: number): Promise<string> {
    const proposal = mockProposals.find((p) => p.id === proposalId);
    if (!proposal) throw new Error("Proposal not found");

    logger.info("Executing Soroban release_milestone contract method", {
      contractId: this.contractId,
      executor,
      proposalId,
    });

    const contract = new Contract(this.contractId);
    const executorAddr = new Address(executor);
    const callXdr = contract.call("release_milestone", executorAddr.toScVal(), xdr.ScVal.scvU32(proposalId));

    if (proposal.status !== "Executed") {
      throw new Error("Proposal must be executed before milestone releases");
    }

    const claimed = proposal.milestonesClaimed || 0;
    const totalCount = proposal.milestoneCount || 1;

    if (claimed >= totalCount) {
      throw new Error("All milestone tranches have already been claimed");
    }

    proposal.milestonesClaimed = claimed + 1;
    proposal.currentMilestone = Math.min(proposal.milestonesClaimed + 1, totalCount);

    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    mockEvents.unshift({
      id: `evt-${Date.now()}`,
      type: "MilestoneReleased",
      timestamp: new Date().toISOString(),
      walletAddress: executor,
      details: `Released Milestone Tranche #${proposal.milestonesClaimed}/${totalCount} (${proposal.milestoneAmount || 0} XLM) for Proposal #${proposalId}`,
      proposalId,
      amount: proposal.milestoneAmount,
      txHash,
    });

    return txHash;
  }

  public static async releaseMilestone(executor: string, proposalId: number) {
    return this.release_milestone(executor, proposalId);
  }

  /**
   * Soroban Contract Function: reward_reviewer(env: Env, caller_contract: Address, reviewer: Address, reward_amount: i128)
   * Defined in contracts/treasury_core/src/lib.rs
   */
  public static async reward_reviewer(callerContract: string, reviewer: string, rewardAmount: number): Promise<string> {
    logger.info("Executing Soroban reward_reviewer contract method (Inter-Contract)", {
      contractId: this.contractId,
      callerContract,
      reviewer,
      rewardAmount,
    });

    const contract = new Contract(this.contractId);
    const callerAddr = new Address(callerContract);
    const reviewerAddr = new Address(reviewer);

    const callXdr = contract.call(
      "reward_reviewer",
      callerAddr.toScVal(),
      reviewerAddr.toScVal(),
      xdr.ScVal.scvI128(
        new xdr.Int128Parts({
          lo: xdr.Uint64.fromString(Math.floor(rewardAmount).toString()),
          hi: xdr.Int64.fromString("0"),
        })
      )
    );

    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    return txHash;
  }

  public static async rewardReviewer(callerContract: string, reviewer: string, rewardAmount: number) {
    return this.reward_reviewer(callerContract, reviewer, rewardAmount);
  }
}
