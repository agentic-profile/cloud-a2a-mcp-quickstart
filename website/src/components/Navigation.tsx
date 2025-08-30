import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ThemeToggle } from './index';

const Navigation = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navigation = [
        { name: 'Home', href: '/', current: location.pathname === '/' },
        { name: 'Chat', href: '/chat', current: location.pathname === '/chat' },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Desktop Navigation */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="flex items-center space-x-3">
                                <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">DA</span>
                                </div>
                                <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                    Decentralized Agents
                                </span>
                            </Link>
                        </div>
                        
                        {/* Desktop Navigation Links */}
                        <div className="hidden md:ml-10 md:flex md:space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                                        item.current
                                                                                ? 'border-dodgerblue text-gray-900 dark:text-white'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right side - Theme Toggle and Mobile Menu Button */}
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        
                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dodgerblue"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <XMarkIcon className="block h-6 w-6" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                item.current
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-dodgerblue dark:text-dodgerblue border-l-4 border-dodgerblue'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
