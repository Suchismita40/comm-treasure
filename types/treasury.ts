export type ProposalStatus = "Active" | "Passed" | "Rejected" | "Executed";

export interface Proposal {
  id: number;
  creator: string;
  title: string;
  description: string;
  recipient: string;
  amount: number; // total amount in XLM
  votesYes: number;
  votesNo: number;
  targetLedger: number;
  status: ProposalStatus;
  createdAt: string;

  // Milestone-Based Escrow Fields
  milestoneCount?: number;
  currentMilestone?: number;
  milestoneAmount?: number;
  milestonesClaimed?: number;
}

export interface TreasuryStats {
  totalBalance: number; // in XLM
  totalProposals: number;
  activeProposals: number;
  totalExecuted: number;
  admin: string;
  memberCount: number;
}

export type EventType =
  | "Deposit"
  | "ProposalCreated"
  | "VoteSubmitted"
  | "ProposalExecuted"
  | "MilestoneReleased"
  | "UserLogin"
  | "TxRetryAttempt";

export interface TreasuryEvent {
  id: string;
  type: EventType;
  timestamp: string;
  walletAddress: string;
  details: string;
  amount?: number;
  proposalId?: number;
  txHash: string;
}

export type TxStatus = "Pending" | "Success" | "Failed";

export interface TransactionRecord {
  id: string;
  hash: string;
  functionName: string;
  status: TxStatus;
  timestamp: string;
  explorerUrl: string;
  errorMessage?: string;
  params?: Record<string, any>;

  // Transaction Retry System Fields
  retryCount?: number;
  maxRetries?: number;
  canRetry?: boolean;
  lastErrorReason?: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  selectedWallet: string | null;
  xlmBalance: number;
  network: string;
  isConnecting: boolean;
  error: string | null;
}
