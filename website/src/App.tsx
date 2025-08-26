import { SparklesIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from './components/ThemeToggle';
import { ZustandDemo } from './components/ZustandDemo';

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 text-gray-900 dark:text-white transition-colors duration-300">
            {/* Header */}
            <header className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <SparklesIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                Agentic Profile
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-lg transition-colors duration-200 text-white">
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                        Welcome to the Future
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Experience seamless theme switching with our beautiful light and dark mode
                        support. Click the sun/moon icon in the top right to toggle between themes!
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                            <SparklesIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                            Smart Themes
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Automatically detects your system preference and remembers your choice.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                            <SparklesIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                            Smooth Transitions
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Beautiful animations when switching between light and dark themes.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                            <SparklesIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                            Persistent Storage
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Your theme preference is saved and restored across browser sessions.
                        </p>
                    </div>
                </div>

                {/* Zustand Demo Section */}
                <div className="mb-16">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
                        Zustand State Management
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-center max-w-3xl mx-auto">
                        Experience the power of Zustand with this interactive demo. Try logging in,
                        updating preferences, and see how state persists across the application.
                    </p>
                    <div className="max-w-4xl mx-auto">
                        <ZustandDemo />
                    </div>
                </div>

                {/* Theme Demo Section */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        Theme Demo
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        This section demonstrates how different elements look in both themes
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">
                                Light Theme Elements
                            </h4>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <p>• White background with subtle shadows</p>
                                <p>• Dark text for optimal readability</p>
                                <p>• Soft purple and pink accents</p>
                                <p>• Clean, modern appearance</p>
                            </div>
                        </div>

                        <div className="bg-gray-800 dark:bg-gray-900 p-6 rounded-lg border border-gray-700 dark:border-gray-600">
                            <h4 className="font-semibold mb-3 text-white dark:text-gray-100">
                                Dark Theme Elements
                            </h4>
                            <div className="space-y-2 text-sm text-gray-300 dark:text-gray-400">
                                <p>• Deep dark backgrounds</p>
                                <p>• Light text for contrast</p>
                                <p>• Bright purple and pink highlights</p>
                                <p>• Easy on the eyes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="container mx-auto px-6 py-12 mt-20">
                <div className="text-center text-gray-600 dark:text-gray-400">
                    <p>Built with ❤️ using React, Vite, Tailwind CSS, and HeroUI</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
