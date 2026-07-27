import { create } from "zustand";
import { TransactionRecord, TxStatus } from "../../types/treasury";
import { STELLAR_CONFIG } from "../config";
import { useEventStore } from "./useEventStore";

interface TransactionStoreState {
  transactions: TransactionRecord[];
  activePendingTx: TransactionRecord | null;

  // Actions
  addTransaction: (functionName: string, hash: string, params?: Record<string, any>) => string;
  updateTxStatus: (id: string, status: TxStatus, errorMessage?: string) => void;
  retryTransaction: (id: string) => Promise<boolean>;
  clearActiveTx: () => void;
}

export const useTransactionStore = create<TransactionStoreState>((set, get) => ({
  transactions: [
    {
      id: "tx-init-001",
      hash: "9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
      functionName: "deposit",
      status: "Success",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      explorerUrl: `${STELLAR_CONFIG.explorerUrl}/tx/9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e`,
      params: { amount: "20,000 XLM" },
      retryCount: 0,
      maxRetries: 3,
      canRetry: false,
    },
    {
      id: "tx-init-002",
      hash: "0xb2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01",
      functionName: "create_proposal",
      status: "Success",
      timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
      explorerUrl: `${STELLAR_CONFIG.explorerUrl}/tx/0xb2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef01`,
      params: { title: "Community Treasury Smart Contract Security Audit" },
      retryCount: 0,
      maxRetries: 3,
      canRetry: false,
    },
    {
      id: "tx-init-003",
      hash: "0x7788990011223344556677889900112233445566778899001122334455667788",
      functionName: "vote",
      status: "Failed",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      explorerUrl: `${STELLAR_CONFIG.explorerUrl}/tx/0x7788990011223344556677889900112233445566778899001122334455667788`,
      params: { proposalId: 4, choice: "YES" },
      errorMessage: "Simulation error: Ledger sequence mismatch during Soroban RPC broadcast",
      lastErrorReason: "Simulation Error: Sequence Mismatch",
      retryCount: 1,
      maxRetries: 3,
      canRetry: true,
    },
  ],
  activePendingTx: null,

  addTransaction: (functionName: string, hash: string, params?: Record<string, any>) => {
    const id = `tx-${Date.now()}`;
    const newTx: TransactionRecord = {
      id,
      hash,
      functionName,
      status: "Pending",
      timestamp: new Date().toISOString(),
      explorerUrl: `${STELLAR_CONFIG.explorerUrl}/tx/${hash}`,
      params,
      retryCount: 0,
      maxRetries: 3,
      canRetry: false,
    };

    set((state) => ({
      transactions: [newTx, ...state.transactions],
      activePendingTx: newTx,
    }));

    return id;
  },

  updateTxStatus: (id: string, status: TxStatus, errorMessage?: string) => {
    set((state) => {
      const updatedList = state.transactions.map((tx) => {
        if (tx.id === id) {
          const isFailed = status === "Failed";
          const retriesUsed = tx.retryCount || 0;
          const maxRetries = tx.maxRetries || 3;
          const canRetry = isFailed && retriesUsed < maxRetries;

          return {
            ...tx,
            status,
            errorMessage,
            lastErrorReason: errorMessage || tx.lastErrorReason,
            canRetry,
          };
        }
        return tx;
      });

      const active =
        state.activePendingTx?.id === id
          ? updatedList.find((t) => t.id === id) || null
          : state.activePendingTx;

      return {
        transactions: updatedList,
        activePendingTx: active,
      };
    });
  },

  retryTransaction: async (id: string): Promise<boolean> => {
    const { transactions } = get();
    const tx = transactions.find((t) => t.id === id);

    if (!tx || !tx.canRetry || (tx.retryCount || 0) >= (tx.maxRetries || 3)) {
      return false;
    }

    const nextAttempt = (tx.retryCount || 0) + 1;
    const maxRetries = tx.maxRetries || 3;

    // Update status to Pending with incremented retry count
    set((state) => {
      const updated = state.transactions.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "Pending" as TxStatus,
              retryCount: nextAttempt,
              canRetry: false,
            }
          : t
      );
      const active = updated.find((t) => t.id === id) || null;
      return { transactions: updated, activePendingTx: active };
    });

    // Emit live retry attempt event to Activity Feed
    try {
      useEventStore.getState().addLiveEvent({
        id: `evt-retry-${Date.now()}`,
        type: "TxRetryAttempt",
        timestamp: new Date().toISOString(),
        walletAddress: "GTRANSACTIONRETRYEXECUTORSTELLARTESTNET",
        details: `Re-simulating & retrying transaction ${tx.functionName} (Attempt ${nextAttempt}/${maxRetries})`,
        txHash: tx.hash,
      });
    } catch {}

    // Re-simulate contract invocation delay
    await new Promise((res) => setTimeout(res, 1500));

    // Simulate successful retry outcome for attempt <= 3
    const isSuccess = nextAttempt <= 3;

    if (isSuccess) {
      set((state) => {
        const updated = state.transactions.map((t) =>
          t.id === id
            ? {
                ...t,
                status: "Success" as TxStatus,
                canRetry: false,
                errorMessage: undefined,
              }
            : t
        );
        const active = updated.find((t) => t.id === id) || null;
        return { transactions: updated, activePendingTx: active };
      });
      return true;
    } else {
      const finalError = `Transaction failed after ${maxRetries} maximum retry attempts. Exceeded RPC sequence window.`;
      set((state) => {
        const updated = state.transactions.map((t) =>
          t.id === id
            ? {
                ...t,
                status: "Failed" as TxStatus,
                canRetry: false,
                errorMessage: finalError,
                lastErrorReason: finalError,
              }
            : t
        );
        const active = updated.find((t) => t.id === id) || null;
        return { transactions: updated, activePendingTx: active };
      });
      return false;
    }
  },

  clearActiveTx: () => set({ activePendingTx: null }),
}));
