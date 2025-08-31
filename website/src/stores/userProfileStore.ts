import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AgenticProfile, JWKSet } from '@agentic-profile/common/schema';

export interface UserProfile {
  profile: AgenticProfile;
  keyring: JWKSet[];
}

interface UserProfileState {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  clearUserProfile: () => void;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      userProfile: null,
      setUserProfile: (profile) => set({ userProfile: profile }),
      clearUserProfile: () => set({ userProfile: null }),
    }),
    {
      name: 'user-profile-storage',
    }
  )
);
