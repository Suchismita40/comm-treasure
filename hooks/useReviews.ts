import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewContractClient } from "../lib/stellar/review-client";
import { useTransactionStore } from "../lib/store/useTransactionStore";
import { useWalletStore } from "../lib/store/useWalletStore";
import { useAuthStore } from "../lib/store/useAuthStore";
import { useEventStore } from "../lib/store/useEventStore";

export function useReviews() {
  const queryClient = useQueryClient();
  const { addTransaction, updateTxStatus } = useTransactionStore();
  const { address } = useWalletStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { fetchEvents } = useEventStore();

  // Query All Reviews
  const reviewsQuery = useQuery({
    queryKey: ["community-reviews"],
    queryFn: () => ReviewContractClient.fetchReviews(),
    refetchInterval: 5000,
  });

  // Mutation: Submit Review
  const submitReviewMutation = useMutation({
    mutationFn: async (data: {
      proposalId: number;
      proposalTitle: string;
      rating: number;
      feedback: string;
    }) => {
      if (!address) throw new Error("Wallet not connected");
      if (!isAuthenticated) {
        openAuthModal();
        throw new Error("Authentication required. Please sign the login challenge.");
      }

      const { reviewId, txHash } = await ReviewContractClient.submitReview(
        address,
        data.proposalId,
        data.proposalTitle,
        data.rating,
        data.feedback
      );

      const txId = addTransaction("submit_review", txHash, {
        proposalId: data.proposalId,
        rating: `${data.rating} Stars`,
      });

      await new Promise((res) => setTimeout(res, 1200));
      updateTxStatus(txId, "Success");
      return { reviewId, txHash };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-reviews"] });
      fetchEvents();
    },
    onError: (err: any) => {
      if (err?.message?.includes("Authentication required")) return;
      const hash = `0x${Math.random().toString(36).substring(2, 12)}`;
      const txId = addTransaction("submit_review", hash);
      updateTxStatus(txId, "Failed", err?.message || "Failed to submit review");
    },
  });

  // Mutation: Claim Reviewer Reward via Inter-Contract Call
  const claimRewardMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      if (!address) throw new Error("Wallet not connected");
      if (!isAuthenticated) {
        openAuthModal();
        throw new Error("Authentication required. Please sign the login challenge.");
      }

      const txHash = await ReviewContractClient.claimReviewerReward(address, reviewId);

      const txId = addTransaction("claim_reviewer_reward (inter-contract)", txHash, {
        reviewId,
        reward: "100 XLM",
      });

      await new Promise((res) => setTimeout(res, 1500));
      updateTxStatus(txId, "Success");
      return txHash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["treasury-stats"] });
      fetchEvents();
    },
    onError: (err: any) => {
      if (err?.message?.includes("Authentication required")) return;
      const hash = `0x${Math.random().toString(36).substring(2, 12)}`;
      const txId = addTransaction("claim_reviewer_reward (inter-contract)", hash);
      updateTxStatus(txId, "Failed", err?.message || "Failed to claim reviewer reward");
    },
  });

  return {
    reviews: reviewsQuery.data || [],
    isLoadingReviews: reviewsQuery.isLoading,
    submitReview: submitReviewMutation.mutateAsync,
    isSubmittingReview: submitReviewMutation.isPending,
    claimReward: claimRewardMutation.mutateAsync,
    isClaimingReward: claimRewardMutation.isPending,
  };
}
