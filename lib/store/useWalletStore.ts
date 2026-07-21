import { create } from "zustand";
import { walletManager, WalletError } from "../stellar/wallet-kit";

interface WalletStoreState {
  isConnected: boolean;
  address: string | null;
  selectedWallet: string | null;
  xlmBalance: number;
  network: string;
  isConnecting: boolean;
  error: string | null;
  isModalOpen: boolean;

  // Actions
  openWalletModal: () => void;
  closeWalletModal: () => void;
  connectWallet: (walletId: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  clearError: () => void;
}

export const useWalletStore = create<WalletStoreState>((set, get) => ({
  isConnected: false,
  address: null,
  selectedWallet: null,
  xlmBalance: 0,
  network: "testnet",
  isConnecting: false,
  error: null,
  isModalOpen: false,

  openWalletModal: () => set({ isModalOpen: true, error: null }),
  closeWalletModal: () => set({ isModalOpen: false }),

  connectWallet: async (walletId: string) => {
    set({ isConnecting: true, error: null });
    try {
      const res = await walletManager.connect(walletId);
      set({
        isConnected: true,
        address: res.address,
        selectedWallet: res.walletId,
        xlmBalance: res.balance,
        isConnecting: false,
        isModalOpen: false,
      });
    } catch (err: any) {
      let errorMsg = err?.message || "Failed to connect wallet";
      set({
        isConnecting: false,
        error: errorMsg,
      });
    }
  },

  disconnectWallet: async () => {
    await walletManager.disconnect();
    set({
      isConnected: false,
      address: null,
      selectedWallet: null,
      xlmBalance: 0,
      error: null,
    });
  },

  refreshBalance: async () => {
    const { address } = get();
    if (address) {
      const balance = await walletManager.fetchBalance(address);
      set({ xlmBalance: balance });
    }
  },

  clearError: () => set({ error: null }),
}));
