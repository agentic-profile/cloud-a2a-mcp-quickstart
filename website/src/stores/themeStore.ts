import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useRef } from 'react';

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
            },
            setTheme: (theme: Theme) => {
                set({ theme });
            },
        }),
        {
            name: 'theme-storage', // unique name for localStorage key
        }
    )
);

// Custom hook to handle DOM updates - React 19 compatible
export const useThemeEffect = () => {
    const theme = useThemeStore(state => state.theme);
    const prevThemeRef = useRef<Theme | null>(null);
    
    useEffect(() => {
        // Only update DOM if theme actually changed
        if (prevThemeRef.current !== theme && typeof window !== 'undefined') {
            const root = window.document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(theme);
            prevThemeRef.current = theme;
        }
    }, [theme]);
};

