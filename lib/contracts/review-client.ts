import { STELLAR_CONFIG } from "../config";
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
    reviewer: "GADMINSTELLARTESTNETCOMMUNITYTREASURYADMIN0123456789",
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
  public static contractId = STELLAR_CONFIG.communityReviewsContractId;

  /**
   * Soroban Function: list_reviews(env: Env, limit: u32) -> Vec<Review>
   */
  public static async list_reviews(limit = 50): Promise<ReviewItem[]> {
    logger.info("Executing Soroban list_reviews contract method", {
      contractId: this.contractId,
      limit,
    });
    return [...mockReviews].slice(0, limit);
  }

  public static async fetchReviews(): Promise<ReviewItem[]> {
    return this.list_reviews(50);
  }

  /**
   * Soroban Function: get_review(env: Env, review_id: u32) -> Review
   */
  public static async get_review(reviewId: number): Promise<ReviewItem> {
    logger.info("Executing Soroban get_review contract method", {
      contractId: this.contractId,
      reviewId,
    });
    const review = mockReviews.find((r) => r.id === reviewId);
    if (!review) throw new Error("Review not found");
    return { ...review };
  }

  /**
   * Soroban Function: submit_review(env: Env, reviewer: Address, proposal_id: u32, rating: u32, feedback: String) -> u32
   */
  public static async submit_review(
    reviewer: string,
    proposalId: number,
    proposalTitle: string,
    rating: number,
    feedback: string
  ): Promise<{ reviewId: number; txHash: string }> {
    logger.info("Executing Soroban submit_review contract method", {
      contractId: this.contractId,
      reviewer,
      proposalId,
      rating,
    });

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5 stars");
    }

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

  public static async submitReview(
    reviewer: string,
    proposalId: number,
    proposalTitle: string,
    rating: number,
    feedback: string
  ) {
    return this.submit_review(reviewer, proposalId, proposalTitle, rating, feedback);
  }

  /**
   * Soroban Function: claim_reviewer_reward(env: Env, reviewer: Address, review_id: u32, treasury_core_contract: Address)
   * Triggers Inter-Contract Communication: CommunityReviews -> TreasuryCore.reward_reviewer
   */
  public static async claim_reviewer_reward(
    reviewer: string,
    reviewId: number,
    treasuryCoreContract: string = STELLAR_CONFIG.treasuryCoreContractId
  ): Promise<string> {
    logger.info("Executing Soroban claim_reviewer_reward contract method (Inter-Contract)", {
      contractId: this.contractId,
      targetCoreContract: treasuryCoreContract,
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

  public static async claimReviewerReward(
    reviewer: string,
    reviewId: number
  ) {
    return this.claim_reviewer_reward(reviewer, reviewId);
  }
}
