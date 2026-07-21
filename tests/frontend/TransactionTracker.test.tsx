import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransactionTracker } from "../../components/TransactionTracker";
import { useTransactionStore } from "../../lib/store/useTransactionStore";

describe("TransactionTracker Component", () => {
  beforeEach(() => {
    useTransactionStore.setState({
      activePendingTx: null,
      transactions: [],
    });
  });

  it("renders pending transaction tracker toast when transaction is active", () => {
    useTransactionStore.setState({
      activePendingTx: {
        id: "tx-test-01",
        hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        functionName: "deposit",
        status: "Pending",
        timestamp: new Date().toISOString(),
        explorerUrl: "https://stellar.expert/explorer/testnet/tx/0x1234567890abcdef",
      },
    });

    render(<TransactionTracker />);
    expect(screen.getByText("Transaction Pending")).toBeInTheDocument();
    expect(screen.getByText("deposit")).toBeInTheDocument();
  });

  it("displays success status and Stellar Expert link", () => {
    useTransactionStore.setState({
      activePendingTx: {
        id: "tx-test-02",
        hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678",
        functionName: "create_proposal",
        status: "Success",
        timestamp: new Date().toISOString(),
        explorerUrl: "https://stellar.expert/explorer/testnet/tx/0xabcdef1234567890",
      },
    });

    render(<TransactionTracker />);
    expect(screen.getByText("Transaction Success")).toBeInTheDocument();
    expect(screen.getByText("Stellar Expert")).toBeInTheDocument();
  });
});
