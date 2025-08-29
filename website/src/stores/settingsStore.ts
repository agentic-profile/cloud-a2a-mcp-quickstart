import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  serverUrl: string;
  setServerUrl: (url: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      serverUrl: 'http://localhost:3000',
      setServerUrl: (url) => set({ serverUrl: url }),
    }),
    {
      name: 'settings-storage',
    }
  )
);

