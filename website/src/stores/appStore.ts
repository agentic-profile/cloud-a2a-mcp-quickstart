import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User profile state
export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    preferences: {
        notifications: boolean;
        newsletter: boolean;
        language: string;
    };
}

// App settings state
export interface AppSettings {
    sidebarCollapsed: boolean;
    compactMode: boolean;
    autoSave: boolean;
}

// Main app state
export interface AppState {
    // User state
    user: UserProfile | null;
    isAuthenticated: boolean;

    // App settings
    settings: AppSettings;

    // UI state
    isLoading: boolean;
    currentPage: string;

    // Actions
    setUser: (user: UserProfile | null) => void;
    updateUserProfile: (updates: Partial<UserProfile>) => void;
    setAuthenticated: (status: boolean) => void;

    updateSettings: (updates: Partial<AppSettings>) => void;
    toggleSidebar: () => void;

    setLoading: (loading: boolean) => void;
    setCurrentPage: (page: string) => void;

    // Computed values
    getUserDisplayName: () => string;
    hasUserPreference: (key: keyof UserProfile['preferences']) => boolean;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            isAuthenticated: false,
            settings: {
                sidebarCollapsed: false,
                compactMode: false,
                autoSave: true,
            },
            isLoading: false,
            currentPage: 'home',

            // Actions
            setUser: user => set({ user, isAuthenticated: !!user }),

            updateUserProfile: updates => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...updates } });
                }
            },

            setAuthenticated: status => set({ isAuthenticated: status }),

            updateSettings: updates => {
                const currentSettings = get().settings;
                set({ settings: { ...currentSettings, ...updates } });
            },

            toggleSidebar: () => {
                const currentSettings = get().settings;
                set({
                    settings: {
                        ...currentSettings,
                        sidebarCollapsed: !currentSettings.sidebarCollapsed,
                    },
                });
            },

            setLoading: loading => set({ isLoading: loading }),

            setCurrentPage: page => set({ currentPage: page }),

            // Computed values
            getUserDisplayName: () => {
                const user = get().user;
                return user?.name || user?.email || 'Guest';
            },

            hasUserPreference: key => {
                const user = get().user;
                const value = user?.preferences?.[key];
                // For boolean values, return as-is; for string values, check if truthy
                return typeof value === 'boolean' ? value : Boolean(value);
            },
        }),
        {
            name: 'app-storage',
            partialize: state => ({
                // Only persist certain parts of the state
                user: state.user,
                settings: state.settings,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

// Selector hooks for better performance
export const useUser = () => useAppStore(state => state.user);
export const useIsAuthenticated = () => useAppStore(state => state.isAuthenticated);
export const useSettings = () => useAppStore(state => state.settings);
export const useIsLoading = () => useAppStore(state => state.isLoading);
export const useCurrentPage = () => useAppStore(state => state.currentPage);

// Action hooks
export const useAppActions = () =>
    useAppStore(state => ({
        setUser: state.setUser,
        updateUserProfile: state.updateUserProfile,
        setAuthenticated: state.setAuthenticated,
        updateSettings: state.updateSettings,
        toggleSidebar: state.toggleSidebar,
        setLoading: state.setLoading,
        setCurrentPage: state.setCurrentPage,
    }));
