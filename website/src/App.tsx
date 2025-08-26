import { SparklesIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from './components/ThemeToggle';
import { Routes, Route, Link } from 'react-router-dom';
import { ChatPage } from './pages/ChatPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 text-gray-900 dark:text-white transition-colors duration-300">
                    {/* Header */}
                    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                        <div className="container mx-auto px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <SparklesIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                            Decentralized Agents Demo
                                        </h1>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Link 
                                        to="/chat" 
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 rounded-lg transition-colors duration-200 text-white"
                                    >
                                        Chat with Agent
                                    </Link>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Hero Section */}
                    <main className="container mx-auto px-6 py-16">
                        <div className="text-center">
                            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                Welcome to Decentralized Agents
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                                Experience the future of AI with our decentralized agent platform. 
                                Chat with intelligent agents that operate on blockchain technology.
                            </p>
                            <Link 
                                to="/chat" 
                                className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                            >
                                Start Chatting Now
                            </Link>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="container mx-auto px-6 py-12 mt-20">
                        <div className="text-center text-gray-600 dark:text-gray-400">
                            <p>Built with ❤️ using React, Vite, Tailwind CSS, and HeroUI</p>
                        </div>
                    </footer>
                </div>
            } />
            <Route path="/chat" element={<ChatPage />} />
        </Routes>
    );
}

export default App;
