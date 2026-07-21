import { useAuthStore } from "../lib/store/useAuthStore";
import { useWalletStore } from "../lib/store/useWalletStore";
import { useEventStore } from "../lib/store/useEventStore";
import { useEffect } from "react";

export function useAuth() {
  const {
    isAuthenticated,
    session,
    profile,
    challenge,
    isAuthModalOpen,
    isLoggingIn,
    openAuthModal,
    closeAuthModal,
    initializeSession,
    generateChallenge,
    loginWithSignature,
    logout,
    updateProfile,
  } = useAuthStore();

  const { isConnected, address, openWalletModal } = useWalletStore();
  const { addLiveEvent } = useEventStore();

  useEffect(() => {
    if (isConnected && address) {
      initializeSession(address);
    }
  }, [isConnected, address, initializeSession]);

  /**
   * Action Gating Wrapper: Prompts wallet connection/login if unauthenticated before executing action
   */
  const requireAuth = async (actionCallback: () => Promise<any> | any) => {
    if (!isConnected || !address) {
      openWalletModal();
      return;
    }
    if (!isAuthenticated) {
      generateChallenge(address);
      openAuthModal();
      return;
    }
    return await actionCallback();
  };

  const handleLogin = async (sig?: string) => {
    if (!address) return;
    await loginWithSignature(address, sig);

    // Emit live event to Activity Feed
    addLiveEvent({
      id: `evt-login-${Date.now()}`,
      type: "UserLogin" as any,
      timestamp: new Date().toISOString(),
      walletAddress: address,
      details: `Wallet authenticated session established for ${address.substring(0, 6)}...`,
      txHash: `0xauth_${Date.now()}`,
    });
  };

  return {
    isAuthenticated,
    session,
    profile,
    challenge,
    isAuthModalOpen,
    isLoggingIn,
    openAuthModal,
    closeAuthModal,
    requireAuth,
    login: handleLogin,
    logout,
    updateProfile,
  };
}
