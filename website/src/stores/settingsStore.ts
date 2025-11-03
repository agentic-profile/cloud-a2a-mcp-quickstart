import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  serverUrl: string | undefined;
  setServerUrl: (url: string) => void;
  isExpert: boolean;
  setIsExpert: (isExpert: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      serverUrl: undefined,
      setServerUrl: (url) => set({ serverUrl: url }),
      isExpert: false,
      setIsExpert: (isExpert) => set({ isExpert }),
    }),
    {
      name: 'settings-storage',
    }
  )
);

