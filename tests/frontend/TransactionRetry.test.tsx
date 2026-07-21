import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransactionTracker } from "../../components/TransactionTracker";
import { useTransactionStore } from "../../lib/store/useTransactionStore";

describe("Transaction Retry Mechanism", () => {
  beforeEach(() => {
    useTransactionStore.setState({
      activePendingTx: null,
      transactions: [],
    });
  });

  it("displays retry action button on failed transactions when retries are available", () => {
    useTransactionStore.setState({
      activePendingTx: {
        id: "tx-retry-test-01",
        hash: "0x1122334455667788990011223344556677889900112233445566778899001122",
        functionName: "vote",
        status: "Failed",
        timestamp: new Date().toISOString(),
        explorerUrl: "https://stellar.expert/explorer/testnet/tx/0x11223344",
        errorMessage: "Sequence error on RPC node",
        retryCount: 1,
        maxRetries: 3,
        canRetry: true,
      },
    });

    render(<TransactionTracker />);
    expect(screen.getByText("Transaction Failed")).toBeInTheDocument();
    expect(screen.getByText("Retry (2/3)")).toBeInTheDocument();
  });

  it("increments retry count and re-simulates transaction on retry action", async () => {
    useTransactionStore.setState({
      transactions: [
        {
          id: "tx-retry-test-02",
          hash: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
          functionName: "deposit",
          status: "Failed",
          timestamp: new Date().toISOString(),
          explorerUrl: "https://stellar.expert/explorer/testnet/tx/0xabcdef",
          retryCount: 0,
          maxRetries: 3,
          canRetry: true,
        },
      ],
    });

    const success = await useTransactionStore.getState().retryTransaction("tx-retry-test-02");
    expect(success).toBe(true);

    const updated = useTransactionStore.getState().transactions.find((t) => t.id === "tx-retry-test-02");
    expect(updated?.status).toBe("Success");
    expect(updated?.retryCount).toBe(1);
    expect(updated?.canRetry).toBe(false);
  });
});
