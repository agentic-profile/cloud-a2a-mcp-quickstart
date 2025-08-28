import { useLocation, Link } from 'react-router-dom';
import { 
    Bars3Icon, 
    XMarkIcon,
    HomeIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { ThemeToggle } from './ThemeToggle';

interface TopNavigationProps {
    onSidebarToggle: (isOpen: boolean) => void;
    sidebarOpen: boolean;
}

const TopNavigation = ({ onSidebarToggle, sidebarOpen }: TopNavigationProps) => {
    const location = useLocation();

    const getBreadcrumbs = () => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const breadcrumbs = [
            { name: 'Home', href: '/', icon: HomeIcon }
        ];

        if (pathSegments.includes('chat')) {
            breadcrumbs.push({ name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon });
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <nav className="hidden lg:block bg-white dark:bg-gray-800 shadow-sm border-b-4 border-red-500 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left side - Sidebar toggle and Breadcrumbs */}
                    <div className="flex items-center">
                        {/* Sidebar Toggle */}
                        <button
                            onClick={() => onSidebarToggle(!sidebarOpen)}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 flex-shrink-0"
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

                        {/* Breadcrumbs */}
                        <div className="hidden md:flex items-center ml-4">
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-2">
                                    {breadcrumbs.map((breadcrumb, index) => (
                                        <li key={breadcrumb.name} className="flex items-center">
                                            {index > 0 && (
                                                <svg
                                                    className="flex-shrink-0 h-4 w-4 text-gray-300 dark:text-gray-600"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                                </svg>
                                            )}
                                            <Link
                                                to={breadcrumb.href}
                                                className={`ml-2 text-sm font-medium transition-colors duration-200 flex items-center ${
                                                    index === breadcrumbs.length - 1
                                                        ? 'text-purple-600 dark:text-purple-400'
                                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                                }`}
                                            >
                                                <div className="w-4 h-4 flex items-center justify-center mr-1">
                                                    <breadcrumb.icon className="w-4 h-4" />
                                                </div>
                                                {breadcrumb.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ol>
                            </nav>
                        </div>
                    </div>

                    {/* Right side - Logo and Theme Toggle */}
                    <div className="flex items-center space-x-4">
                        {/* Logo - Hidden on mobile, shown on desktop */}
                        <div className="hidden lg:flex items-center">
                            <Link to="/" className="flex items-center space-x-3">
                                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                    A2A and MCP Quickstart
                                </span>
                            </Link>
                        </div>
                        
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNavigation;
