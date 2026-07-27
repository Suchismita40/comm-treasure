import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthModal } from "../../components/AuthModal";
import { useAuthStore } from "../../lib/store/useAuthStore";
import { useWalletStore } from "../../lib/store/useWalletStore";

describe("AuthModal Component", () => {
  beforeEach(() => {
    useWalletStore.setState({
      isConnected: true,
      address: "GBBCVE2IVHV6XWIN22PQAXNILOJUBUC3UYFZ5ZS5P3SCRYQB34MFZDD4",
      selectedWallet: "demo",
    });

    useAuthStore.setState({
      isAuthModalOpen: true,
      isAuthenticated: false,
      isLoggingIn: false,
      challenge: {
        address: "GBBCVE2IVHV6XWIN22PQAXNILOJUBUC3UYFZ5ZS5P3SCRYQB34MFZDD4",
        nonce: "testnonce12345",
        message: "Test Challenge Message",
        timestamp: new Date().toISOString(),
      },
    });
  });

  it("renders wallet authentication modal header and challenge details", () => {
    render(<AuthModal />);
    expect(screen.getByText("Wallet Authentication")).toBeInTheDocument();
    expect(screen.getByText("Sign Challenge Message")).toBeInTheDocument();
    expect(screen.getByText("Nonce: testnonce12345")).toBeInTheDocument();
  });

  it("renders Sign Message & Login action button", () => {
    render(<AuthModal />);
    expect(screen.getByText("Sign Message & Login")).toBeInTheDocument();
  });
});
