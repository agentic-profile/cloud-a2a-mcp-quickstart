// Export all stores
export { useThemeStore } from './themeStore';
export {
    useAppStore,
    useUser,
    useIsAuthenticated,
    useSettings,
    useIsLoading,
    useCurrentPage,
    useAppActions,
} from './appStore';
export { useCounterStore, useCount, useCounterActions } from './counterStore';

// Export types for external use
export { type Theme } from './themeStore';
export { type UserProfile, type AppSettings, type AppState } from './appStore';
export { type CounterState } from './counterStore';
