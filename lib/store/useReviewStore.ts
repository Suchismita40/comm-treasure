import { create } from "zustand";
import { ReviewItem, ReviewContractClient } from "../stellar/review-client";

interface ReviewStoreState {
  reviews: ReviewItem[];
  isLoading: boolean;

  // Actions
  fetchReviews: () => Promise<void>;
  addReview: (review: ReviewItem) => void;
}

export const useReviewStore = create<ReviewStoreState>((set) => ({
  reviews: [],
  isLoading: false,

  fetchReviews: async () => {
    set({ isLoading: true });
    try {
      const data = await ReviewContractClient.fetchReviews();
      set({ reviews: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addReview: (review) =>
    set((state) => ({
      reviews: [review, ...state.reviews],
    })),
}));
