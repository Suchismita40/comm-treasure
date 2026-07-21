import { create } from "zustand";
import { TreasuryEvent, EventType } from "../../types/treasury";
import { TreasuryContractClient } from "../stellar/contract-client";

interface EventStoreState {
  events: TreasuryEvent[];
  filterType: EventType | "ALL";
  isLivePolling: boolean;
  isLoading: boolean;

  // Actions
  fetchEvents: () => Promise<void>;
  setFilterType: (type: EventType | "ALL") => void;
  toggleLivePolling: () => void;
  addLiveEvent: (event: TreasuryEvent) => void;
}

export const useEventStore = create<EventStoreState>((set, get) => ({
  events: [],
  filterType: "ALL",
  isLivePolling: true,
  isLoading: false,

  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const data = await TreasuryContractClient.fetchRecentEvents();
      set({ events: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setFilterType: (type) => set({ filterType: type }),

  toggleLivePolling: () => set((state) => ({ isLivePolling: !state.isLivePolling })),

  addLiveEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events],
    })),
}));
