export interface UserProfile {
  address: string;
  displayName: string;
  avatar: string;
  notificationPreference: "all" | "governance_only" | "rewards_only" | "none";
  joinedAt: string;
}

export interface AuthSession {
  token: string;
  address: string;
  expiresAt: string;
}

export interface LoginChallenge {
  address: string;
  nonce: string;
  message: string;
  timestamp: string;
}
