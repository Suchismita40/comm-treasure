import { STELLAR_CONFIG } from "../config";
import { Proposal, TreasuryEvent, TreasuryStats } from "../../types/treasury";
import { logger } from "../logger";

// Initial state with milestone escrow metadata
let mockTreasuryState: TreasuryStats = {
  totalBalance: 45000.0,
  totalProposals: 4,
  activeProposals: 2,
  totalExecuted: 2,
  admin: "GADMINSTELLARTESTNETCOMMUNITYTREASURYADMIN01",
  memberCount: 148,
};

let mockProposals: Proposal[] = [
  {
    id: 1,
    creator: "GADMINSTELLARTESTNETCOMMUNITYTREASURYADMIN01",
    title: "Stellar Developer Bootcamp Q3 Grant",
    description:
      "Fund 10 full scholarships for open-source Soroban smart contract training and workshops in the community.",
    recipient: "GBOOTCAMPDEVRECEIVERSTELLARTESTNET012345",
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
    creator: "GDEVCOMMUNITYMEMBERSTELLARTESTNET98765",
    title: "Soroban Event Indexer Infrastructure",
    description:
      "Deploy high-throughput RPC node clusters for real-time indexing of Soroban treasury smart contract events.",
    recipient: "GINDEXERSERVICERECEIVERSTELLARTESTNET99",
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
    creator: "GSECURITYAUDITORSTELLARTESTNET11223344",
    title: "Community Treasury Smart Contract Security Audit",
    description:
      "Comprehensive formal audit of the Community Treasury Rust codebase by certified security researchers.",
    recipient: "GAUDITFIRMRECEIVERSTELLARTESTNET556677",
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
    creator: "GDESIGNERSTELLARTESTNET889900112233",
    title: "DApp UI Accessibility & Dark Theme Overhaul",
    description:
      "Enhance shadcn/ui components, responsive layout, dark theme contrast, and real-time transaction indicators.",
    recipient: "GDESIGNAGENCYRECEIVERSTELLARTESTNET443322",
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
    walletAddress: "GADMINSTELLARTESTNETCOMMUNITYTREASURYADMIN01",
    details: "Deposited 20,000 XLM into Community Treasury Vault",
    amount: 20000.0,
    txHash: "0xa1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0",
  },
  {
    id: "evt-002",
    type: "ProposalCreated",
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    walletAddress: "GSECURITYAUDITORSTELLARTESTNET11223344",
    details: "Created Proposal #3: Security Audit (8,000 XLM across 2 Milestones)",
    proposalId: 3,
    amount: 8000.0,
    txHash: "0xb2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01",
  },
];

export class TreasuryContractClient {
  public static async fetchTreasuryStats(): Promise<TreasuryStats> {
    return { ...mockTreasuryState };
  }

  public static async fetchProposals(): Promise<Proposal[]> {
    return [...mockProposals];
  }

  public static async fetchRecentEvents(): Promise<TreasuryEvent[]> {
    return [...mockEvents];
  }

  public static async deposit(fromAddress: string, amount: number): Promise<string> {
    if (amount <= 0) throw new Error("Deposit amount must be positive");
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

  public static async createProposal(
    creator: string,
    title: string,
    description: string,
    recipient: string,
    amount: number,
    milestoneCount = 4,
    durationLedgers = 5000
  ): Promise<{ proposalId: number; txHash: string }> {
    const newId = mockProposals.length + 1;
    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const mCount = milestoneCount || 1;
    const mAmount = amount / mCount;

    const newProposal: Proposal = {
      id: newId,
      creator,
      title,
      description,
      recipient,
      amount,
      votesYes: 0,
      votesNo: 0,
      targetLedger: 530000 + durationLedgers,
      status: "Active",
      createdAt: new Date().toISOString(),
      milestoneCount: mCount,
      currentMilestone: 1,
      milestoneAmount: mAmount,
      milestonesClaimed: 0,
    };

    mockProposals.unshift(newProposal);
    mockTreasuryState.totalProposals += 1;
    mockTreasuryState.activeProposals += 1;

    mockEvents.unshift({
      id: `evt-${Date.now()}`,
      type: "ProposalCreated",
      timestamp: new Date().toISOString(),
      walletAddress: creator,
      details: `Created Proposal #${newId}: ${title} (${amount.toLocaleString()} XLM across ${mCount} Milestones)`,
      proposalId: newId,
      amount,
      txHash,
    });
    return { proposalId: newId, txHash };
  }

  public static async vote(voter: string, proposalId: number, approve: boolean): Promise<string> {
    const proposal = mockProposals.find((p) => p.id === proposalId);
    if (!proposal) throw new Error("Proposal not found");
    if (proposal.status !== "Active") throw new Error("Proposal is no longer active");

    const voteWeight = 1000;
    if (approve) proposal.votesYes += voteWeight;
    else proposal.votesNo += voteWeight;

    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    mockEvents.unshift({
      id: `evt-${Date.now()}`,
      type: "VoteSubmitted",
      timestamp: new Date().toISOString(),
      walletAddress: voter,
      details: `Voted ${approve ? "YES" : "NO"} on Proposal #${proposalId} (${proposal.title})`,
      proposalId,
      txHash,
    });
    return txHash;
  }

  public static async executeProposal(executor: string, proposalId: number): Promise<string> {
    const proposal = mockProposals.find((p) => p.id === proposalId);
    if (!proposal) throw new Error("Proposal not found");
    if (proposal.status === "Executed") throw new Error("Proposal already executed");

    proposal.status = proposal.votesYes >= proposal.votesNo ? "Executed" : "Rejected";
    if (proposal.status === "Executed") {
      proposal.milestonesClaimed = 1;
      proposal.currentMilestone = 1;
      mockTreasuryState.totalExecuted += 1;
    }
    mockTreasuryState.activeProposals = Math.max(0, mockTreasuryState.activeProposals - 1);

    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    mockEvents.unshift({
      id: `evt-${Date.now()}`,
      type: "ProposalExecuted",
      timestamp: new Date().toISOString(),
      walletAddress: executor,
      details: `Executed Proposal #${proposalId}: Disbursed initial Milestone #1 (${(proposal.milestoneAmount || proposal.amount).toLocaleString()} XLM) to ${proposal.recipient.substring(0, 8)}...`,
      proposalId,
      amount: proposal.milestoneAmount || proposal.amount,
      txHash,
    });
    return txHash;
  }

  /**
   * Release next Milestone Tranche for an executed proposal
   */
  public static async releaseMilestone(executor: string, proposalId: number): Promise<string> {
    logger.info("Executing Soroban release_milestone contract method", { executor, proposalId });

    const proposal = mockProposals.find((p) => p.id === proposalId);
    if (!proposal) throw new Error("Proposal not found");
    if (proposal.status !== "Executed") throw new Error("Proposal must be Executed before releasing milestone tranches");

    const mCount = proposal.milestoneCount || 1;
    const claimed = proposal.milestonesClaimed || 1;

    if (claimed >= mCount) {
      throw new Error("All milestone tranches have already been disbursed for this proposal.");
    }

    const nextClaimed = claimed + 1;
    proposal.milestonesClaimed = nextClaimed;
    proposal.currentMilestone = Math.min(nextClaimed, mCount);

    const trancheAmount = proposal.milestoneAmount || proposal.amount / mCount;
    mockTreasuryState.totalBalance -= trancheAmount;

    const txHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    mockEvents.unshift({
      id: `evt-${Date.now()}`,
      type: "MilestoneReleased",
      timestamp: new Date().toISOString(),
      walletAddress: executor,
      details: `Released Milestone #${nextClaimed} of ${mCount} (${trancheAmount.toLocaleString()} XLM) for Proposal #${proposalId}`,
      proposalId,
      amount: trancheAmount,
      txHash,
    });

    return txHash;
  }
}
