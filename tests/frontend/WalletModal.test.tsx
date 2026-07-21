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
      xlmBalance: 0,
      isConnecting: false,
      error: null,
    });
  });

  it("renders connect wallet header when open", () => {
    render(<WalletModal />);
    expect(screen.getByText("Connect Stellar Wallet")).toBeInTheDocument();
  });

  it("lists supported wallet options including Freighter and Demo", () => {
    render(<WalletModal />);
    expect(screen.getByText("Freighter Wallet")).toBeInTheDocument();
    expect(screen.getByText("Stellar Testnet Keypair (Demo)")).toBeInTheDocument();
  });

  it("displays connected view when wallet is connected", () => {
    useWalletStore.setState({
      isModalOpen: true,
      isConnected: true,
      address: "GDEMOTREASURYVOTER5762XLMBALANCESTELLARTESTNET",
      selectedWallet: "demo",
      xlmBalance: 10000,
    });

    render(<WalletModal />);
    expect(screen.getByText("Wallet Connected")).toBeInTheDocument();
    expect(screen.getByText("Disconnect")).toBeInTheDocument();
  });
});
