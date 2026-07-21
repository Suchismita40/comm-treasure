import { create } from "zustand";
import { AuthSession, UserProfile, LoginChallenge } from "../../types/auth";
import { StellarAuthService } from "../stellar/auth-service";

interface AuthStoreState {
  isAuthenticated: boolean;
  session: AuthSession | null;
  profile: UserProfile | null;
  challenge: LoginChallenge | null;
  isAuthModalOpen: boolean;
  isLoggingIn: boolean;

  // Actions
  openAuthModal: () => void;
  closeAuthModal: () => void;
  initializeSession: (address: string | null) => void;
  generateChallenge: (address: string) => LoginChallenge;
  loginWithSignature: (address: string, signature?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  isAuthenticated: false,
  session: null,
  profile: null,
  challenge: null,
  isAuthModalOpen: false,
  isLoggingIn: false,

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  initializeSession: (address: string | null) => {
    const session = StellarAuthService.getSession();
    if (session && address && session.address === address) {
      const profile = StellarAuthService.getUserProfile(address);
      set({ isAuthenticated: true, session, profile });
    } else {
      set({ isAuthenticated: false, session: null, profile: address ? StellarAuthService.getUserProfile(address) : null });
    }
  },

  generateChallenge: (address: string) => {
    const challenge = StellarAuthService.generateChallenge(address);
    set({ challenge });
    return challenge;
  },

  loginWithSignature: async (address: string, signature?: string) => {
    set({ isLoggingIn: true });
    try {
      const challenge = get().challenge || StellarAuthService.generateChallenge(address);
      const session = await StellarAuthService.verifySignatureAndLogin(address, challenge, signature);
      const profile = StellarAuthService.getUserProfile(address);

      set({
        isAuthenticated: true,
        session,
        profile,
        isLoggingIn: false,
        isAuthModalOpen: false,
      });
    } catch {
      set({ isLoggingIn: false });
    }
  },

  logout: () => {
    StellarAuthService.clearSession();
    set({ isAuthenticated: false, session: null, challenge: null });
  },

  updateProfile: (updates: Partial<UserProfile>) => {
    const current = get().profile;
    if (current) {
      const updated = StellarAuthService.updateUserProfile(current.address, updates);
      set({ profile: updated });
    }
  },
}));
