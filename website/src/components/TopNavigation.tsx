import { Link } from 'react-router-dom';
import { 
    Bars3Icon, 
    XMarkIcon
} from '@heroicons/react/24/outline';
import { ThemeToggle } from './ThemeToggle';

interface TopNavigationProps {
    onSidebarToggle: (isOpen: boolean) => void;
    sidebarOpen: boolean;
}

const TopNavigation = ({ onSidebarToggle, sidebarOpen }: TopNavigationProps) => {
    return (
        <nav className="hidden lg:block bg-white dark:bg-gray-800 shadow-sm border-b-4 border-red-500 dark:border-gray-700 w-full max-w-full overflow-hidden">
            <div className="w-full px-2">
                <div className="flex justify-between items-center h-16 w-full max-w-full">
                    {/* Left side - Sidebar toggle and Logo */}
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                        {/* Sidebar Toggle - Far left */}
                        <button
                            onClick={() => onSidebarToggle(!sidebarOpen)}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-dodgerblue flex-shrink-0"
                        >
                            <span className="sr-only">Toggle sidebar</span>
                            <div className="w-5 h-5 flex items-center justify-center">
                                {sidebarOpen ? (
                                    <XMarkIcon className="w-5 h-5" />
                                ) : (
                                    <Bars3Icon className="w-5 h-5" />
                                )}
                            </div>
                        </button>

                        {/* Logo */}
                        <div className="flex items-center flex-shrink-0">
                            <Link to="/" className="flex items-center space-x-3">
                                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                    Cloud A2A and MCP Quickstart
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Theme Toggle */}
                    <div className="flex items-center flex-shrink-0">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNavigation;
