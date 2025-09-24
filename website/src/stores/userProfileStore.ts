import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AgenticProfile, JWKSet } from '@agentic-profile/common/schema';

export interface UserProfile {
  profile: AgenticProfile;
  keyring: JWKSet[];
}

interface UserProfileState {
  userProfile: UserProfile | null;
  userAgentDid: string | null;
  verificationId: string | null;
  setUserProfile: (profile: UserProfile | null) => void;
  setUserAgentDid: (did: string | null) => void;
  setVerificationId: (id: string | null) => void;
  clearUserProfile: () => void;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      userProfile: null,
      userAgentDid: null,
      verificationId: null,
      setUserProfile: (profile) => set({ userProfile: profile }),
      setUserAgentDid: (did) => set({ userAgentDid: did }),
      setVerificationId: (id) => set({ verificationId: id }),
      clearUserProfile: () => set({ userProfile: null, userAgentDid: null, verificationId: null }),
    }),
    {
      name: 'user-profile-storage',
    }
  )
);
