import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark';

interface ThemeState {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'dark', // default theme
            toggleTheme: () => {
                const currentTheme = get().theme;
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                set({ theme: newTheme });

                // Update DOM classes
                const root = window.document.documentElement;
                root.classList.remove('light', 'dark');
                root.classList.add(newTheme);
            },
            setTheme: (theme: Theme) => {
                set({ theme });

                // Update DOM classes
                const root = window.document.documentElement;
                root.classList.remove('light', 'dark');
                root.classList.add(theme);
            },
        }),
        {
            name: 'theme-storage', // unique name for localStorage key
            onRehydrateStorage: () => state => {
                // Apply theme to DOM when rehydrating from storage
                if (state?.theme) {
                    const root = window.document.documentElement;
                    root.classList.remove('light', 'dark');
                    root.classList.add(state.theme);
                }
            },
        }
    )
);

// Initialize theme on app start
if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
        try {
            const parsed = JSON.parse(savedTheme);
            if (parsed.state?.theme) {
                const root = window.document.documentElement;
                root.classList.remove('light', 'dark');
                root.classList.add(parsed.state.theme);
            }
        } catch (e) {
            // Fallback to system preference
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            const root = window.document.documentElement;
            root.classList.add(prefersLight ? 'light' : 'dark');
        }
    } else {
        // No saved theme, use system preference
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        const root = window.document.documentElement;
        root.classList.add(prefersLight ? 'light' : 'dark');
    }
}
