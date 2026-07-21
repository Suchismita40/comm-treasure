import { logger } from "../logger";

export interface ReviewItem {
  id: number;
  reviewer: string;
  proposalId: number;
  proposalTitle: string;
  rating: number; // 1 to 5 stars
  feedback: string;
  createdAt: string;
  rewardClaimed: boolean;
  rewardAmount: number;
}

let mockReviews: ReviewItem[] = [
  {
    id: 1,
    reviewer: "GADMINSTELLARTESTNETCOMMUNITYTREASURYADMIN01",
    proposalId: 1,
    proposalTitle: "Stellar Developer Bootcamp Q3 Grant",
    rating: 5,
    feedback:
      "Outstanding initiative! The bootcamp syllabus provides great coverage of Soroban smart contract authorization and event indexing.",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    rewardClaimed: true,
    rewardAmount: 100,
  },
  {
    id: 2,
    reviewer: "GDEVCOMMUNITYMEMBERSTELLARTESTNET98765",
    proposalId: 2,
    proposalTitle: "Soroban Event Indexer Infrastructure",
    rating: 4,
    feedback:
      "Great infrastructure proposal. Node deployment configuration is solid and low latency.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    rewardClaimed: false,
    rewardAmount: 100,
  },
  {
    id: 3,
    reviewer: "GDEMOTREASURYVOTER5762XLMBALANCESTELLARTESTNET",
    proposalId: 3,
    proposalTitle: "Community Treasury Smart Contract Security Audit",
    rating: 5,
    feedback:
      "Essential formal audit for high trust governance. The security team has a strong track record.",
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    rewardClaimed: false,
    rewardAmount: 100,
  },
];

export class ReviewContractClient {
  public static async fetchReviews(): Promise<ReviewItem[]> {
    logger.info("Fetching customer reviews from Soroban Secondary Contract");
    return [...mockReviews];
  }

  public static async submitReview(
    reviewer: string,
    proposalId: number,
    proposalTitle: string,
    rating: number,
    feedback: string
  ): Promise<{ reviewId: number; txHash: string }> {
    logger.info("Submitting customer review to Community Reviews Contract", {
      reviewer,
      proposalId,
      rating,
    });

    const newId = mockReviews.length + 1;
    const txHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    const newReview: ReviewItem = {
      id: newId,
      reviewer,
      proposalId,
      proposalTitle,
      rating,
      feedback,
      createdAt: new Date().toISOString(),
      rewardClaimed: false,
      rewardAmount: 100,
    };

    mockReviews.unshift(newReview);
    return { reviewId: newId, txHash };
  }

  /**
   * Triggers Inter-Contract Communication: Secondary Reviews Contract invokes Treasury Core Contract
   */
  public static async claimReviewerReward(
    reviewer: string,
    reviewId: number
  ): Promise<string> {
    logger.info("Executing Inter-Contract Call: CommunityReviews -> TreasuryCore.reward_reviewer", {
      reviewer,
      reviewId,
    });

    const review = mockReviews.find((r) => r.id === reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    if (review.rewardClaimed) {
      throw new Error("Reviewer reward already claimed");
    }

    review.rewardClaimed = true;

    const interContractTxHash = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    return interContractTxHash;
  }
}
