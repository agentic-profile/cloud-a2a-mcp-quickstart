import { useTheme } from 'next-themes';

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const isLight = theme === 'light';

    return (
        <button
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-300 dark:border-gray-600 text-sm font-medium"
            aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
        >
            {isLight ? (
                <span className="text-gray-700">🌙 Dark</span>
            ) : (
                <span className="text-yellow-500">☀️ Light</span>
            )}
        </button>
    );
};
