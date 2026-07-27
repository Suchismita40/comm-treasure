import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { WalletModal } from "../../components/WalletModal";
import { useWalletStore } from "../../lib/store/useWalletStore";

describe("WalletModal Component", () => {
  beforeEach(() => {
    useWalletStore.setState({
      isModalOpen: true,
      isConnected: false,
      address: null,
      selectedWallet: null,
      isConnecting: false,
      error: null,
    });
  });

  it("renders wallet modal title and supported wallet options", () => {
    render(<WalletModal />);
    expect(screen.getByText("Select Stellar Wallet")).toBeInTheDocument();
    expect(screen.getByText("Freighter Wallet")).toBeInTheDocument();
    expect(screen.getByText("Instant Testnet Demo")).toBeInTheDocument();
  });

  it("displays connected view when wallet is connected", () => {
    useWalletStore.setState({
      isConnected: true,
      address: "GBBCVE2IVHV6XWIN22PQAXNILOJUBUC3UYFZ5ZS5P3SCRYQB34MFZDD4",
      selectedWallet: "demo",
    });

    render(<WalletModal />);
    expect(screen.getByText("Connected Wallet")).toBeInTheDocument();
    expect(screen.getByText("Disconnect Wallet")).toBeInTheDocument();
  });
});
