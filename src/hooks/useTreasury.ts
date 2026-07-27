import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TreasuryContractClient } from "../../lib/contracts/treasury-client";
import { useTransactionStore } from "../../lib/store/useTransactionStore";
import { useWalletStore } from "../../lib/store/useWalletStore";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useEventStore } from "../../lib/store/useEventStore";

export function useTreasury() {
  const queryClient = useQueryClient();
  const { addTransaction, updateTxStatus } = useTransactionStore();
  const { address } = useWalletStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { fetchEvents } = useEventStore();

  // Query Treasury Overview Stats via Soroban get_state()
  const statsQuery = useQuery({
    queryKey: ["treasury-stats"],
    queryFn: () => TreasuryContractClient.get_state(),
    refetchInterval: 5000,
  });

  // Query Proposals List
  const proposalsQuery = useQuery({
    queryKey: ["treasury-proposals"],
    queryFn: () => TreasuryContractClient.fetchProposals(),
    refetchInterval: 5000,
  });

  // Mutation: Deposit Funds via Soroban deposit(from, amount)
  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!address) throw new Error("Wallet not connected");
      if (!isAuthenticated) {
        openAuthModal();
        throw new Error("Authentication required. Please sign the login challenge.");
      }

      const hash = await TreasuryContractClient.deposit(address, amount);
      const txId = addTransaction("deposit", hash, { amount: `${amount} XLM` });

      await new Promise((res) => setTimeout(res, 1500));
      updateTxStatus(txId, "Success");
      return hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treasury-stats"] });
      fetchEvents();
    },
    onError: (err: any, amount) => {
      if (err?.message?.includes("Authentication required")) return;
      const hash = `0x${Math.random().toString(36).substring(2, 12)}`;
      const txId = addTransaction("deposit", hash, { amount: `${amount} XLM` });
      updateTxStatus(txId, "Failed", err?.message || "Deposit transaction failed");
    },
  });

  // Mutation: Create Proposal via Soroban create_proposal(...)
  const createProposalMutation = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      recipient: string;
      amount: number;
      milestoneCount?: number;
    }) => {
      if (!address) throw new Error("Wallet not connected");
      if (!isAuthenticated) {
        openAuthModal();
        throw new Error("Authentication required. Please sign the login challenge.");
      }

      const { proposalId, txHash } = await TreasuryContractClient.create_proposal(
        address,
        data.title,
        data.description,
        data.recipient,
        data.amount,
        data.milestoneCount || 4
      );
      const txId = addTransaction("create_proposal", txHash, { title: data.title, amount: `${data.amount} XLM` });

      await new Promise((res) => setTimeout(res, 1500));
      updateTxStatus(txId, "Success");
      return { proposalId, txHash };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treasury-stats"] });
      queryClient.invalidateQueries({ queryKey: ["treasury-proposals"] });
      fetchEvents();
    },
    onError: (err: any, data) => {
      if (err?.message?.includes("Authentication required")) return;
      const hash = `0x${Math.random().toString(36).substring(2, 12)}`;
      const txId = addTransaction("create_proposal", hash, { title: data.title });
      updateTxStatus(txId, "Failed", err?.message || "Failed to create proposal");
    },
  });

  // Mutation: Vote Proposal via Soroban vote(voter, proposal_id, approve)
  const voteMutation = useMutation({
    mutationFn: async (data: { proposalId: number; approve: boolean }) => {
      if (!address) throw new Error("Wallet not connected");
      if (!isAuthenticated) {
        openAuthModal();
        throw new Error("Authentication required. Please sign the login challenge.");
      }

      const txHash = await TreasuryContractClient.vote(address, data.proposalId, data.approve);
      const txId = addTransaction("vote", txHash, {
        proposalId: data.proposalId,
        choice: data.approve ? "YES" : "NO",
      });

      await new Promise((res) => setTimeout(res, 1200));
      updateTxStatus(txId, "Success");
      return txHash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treasury-proposals"] });
      fetchEvents();
    },
    onError: (err: any, data) => {
      if (err?.message?.includes("Authentication required")) return;
      const hash = `0x${Math.random().toString(36).substring(2, 12)}`;
      const txId = addTransaction("vote", hash, { proposalId: data.proposalId });
      updateTxStatus(txId, "Failed", err?.message || "Failed to cast vote");
    },
  });

  // Mutation: Execute Proposal via Soroban execute_proposal(executor, proposal_id)
  const executeMutation = useMutation({
    mutationFn: async (proposalId: number) => {
      if (!address) throw new Error("Wallet not connected");
      if (!isAuthenticated) {
        openAuthModal();
        throw new Error("Authentication required. Please sign the login challenge.");
      }

      const txHash = await TreasuryContractClient.execute_proposal(address, proposalId);
      const txId = addTransaction("execute_proposal", txHash, { proposalId });

      await new Promise((res) => setTimeout(res, 1500));
      updateTxStatus(txId, "Success");
      return txHash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treasury-stats"] });
      queryClient.invalidateQueries({ queryKey: ["treasury-proposals"] });
      fetchEvents();
    },
    onError: (err: any, proposalId) => {
      if (err?.message?.includes("Authentication required")) return;
      const hash = `0x${Math.random().toString(36).substring(2, 12)}`;
      const txId = addTransaction("execute_proposal", hash, { proposalId });
      updateTxStatus(txId, "Failed", err?.message || "Failed to execute proposal");
    },
  });

  // Mutation: Release Milestone Tranche via Soroban release_milestone(executor, proposal_id)
  const releaseMilestoneMutation = useMutation({
    mutationFn: async (proposalId: number) => {
      if (!address) throw new Error("Wallet not connected");
      if (!isAuthenticated) {
        openAuthModal();
        throw new Error("Authentication required. Please sign the login challenge.");
      }

      const txHash = await TreasuryContractClient.release_milestone(address, proposalId);
      const txId = addTransaction("release_milestone", txHash, { proposalId });

      await new Promise((res) => setTimeout(res, 1500));
      updateTxStatus(txId, "Success");
      return txHash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treasury-stats"] });
      queryClient.invalidateQueries({ queryKey: ["treasury-proposals"] });
      fetchEvents();
    },
    onError: (err: any, proposalId) => {
      if (err?.message?.includes("Authentication required")) return;
      const hash = `0x${Math.random().toString(36).substring(2, 12)}`;
      const txId = addTransaction("release_milestone", hash, { proposalId });
      updateTxStatus(txId, "Failed", err?.message || "Failed to release milestone tranche");
    },
  });

  return {
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,
    proposals: proposalsQuery.data || [],
    isLoadingProposals: proposalsQuery.isLoading,
    deposit: depositMutation.mutateAsync,
    isDepositing: depositMutation.isPending,
    createProposal: createProposalMutation.mutateAsync,
    isCreatingProposal: createProposalMutation.isPending,
    vote: voteMutation.mutateAsync,
    isVoting: voteMutation.isPending,
    executeProposal: executeMutation.mutateAsync,
    isExecuting: executeMutation.isPending,
    releaseMilestone: releaseMilestoneMutation.mutateAsync,
    isReleasingMilestone: releaseMilestoneMutation.isPending,
  };
}
