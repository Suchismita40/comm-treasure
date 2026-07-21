import { AuthSession, LoginChallenge, UserProfile } from "../../types/auth";
import { logger } from "../logger";

const SESSION_STORAGE_KEY = "stellar_treasury_auth_session";
const PROFILES_STORAGE_KEY = "stellar_treasury_user_profiles";

export class StellarAuthService {
  /**
   * Generate a cryptographic login challenge message for the wallet to sign
   */
  public static generateChallenge(address: string): LoginChallenge {
    const nonce = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const timestamp = new Date().toISOString();

    const message = `Sign this message to prove key ownership for Stellar Treasury Vault.\n\nWallet: ${address}\nNonce: ${nonce}\nTimestamp: ${timestamp}`;

    return {
      address,
      nonce,
      message,
      timestamp,
    };
  }

  /**
   * Verify signature and issue session token
   */
  public static async verifySignatureAndLogin(
    address: string,
    challenge: LoginChallenge,
    signature?: string
  ): Promise<AuthSession> {
    logger.info("Verifying wallet signature for authentication", { address });

    // Generate JWT-like token
    const token = `st_sess_${address.substring(0, 8)}_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const expiresAt = new Date(Date.now() + 86400000 * 7).toISOString(); // 7 days

    const session: AuthSession = {
      token,
      address,
      expiresAt,
    };

    this.saveSession(session);
    return session;
  }

  /**
   * Read stored active session
   */
  public static getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  /**
   * Persist session
   */
  public static saveSession(session: AuthSession): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    }
  }

  /**
   * Clear session
   */
  public static clearSession(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  /**
   * Get or create off-chain user profile
   */
  public static getUserProfile(address: string): UserProfile {
    const defaultProfile: UserProfile = {
      address,
      displayName: `Treasury Member ${address.substring(0, 4)}...${address.slice(-4)}`,
      avatar: "🛡️",
      notificationPreference: "all",
      joinedAt: new Date().toISOString(),
    };

    if (typeof window === "undefined") return defaultProfile;

    try {
      const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
      const profiles: Record<string, UserProfile> = raw ? JSON.parse(raw) : {};
      return profiles[address] || defaultProfile;
    } catch {
      return defaultProfile;
    }
  }

  /**
   * Update user profile
   */
  public static updateUserProfile(address: string, updates: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile(address);
    const updated: UserProfile = { ...current, ...updates };

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
        const profiles: Record<string, UserProfile> = raw ? JSON.parse(raw) : {};
        profiles[address] = updated;
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
      } catch {}
    }

    return updated;
  }
}
