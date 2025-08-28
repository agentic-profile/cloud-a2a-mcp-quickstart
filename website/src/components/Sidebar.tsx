import { Link, useLocation } from 'react-router-dom';
import { 
    HomeIcon,
    UserGroupIcon,
    ServerIcon,
    Cog6ToothIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const location = useLocation();

    const navigation = [
        { name: 'Home', href: '/', icon: HomeIcon, current: location.pathname === '/' },
        { name: 'Agents', href: '/agents', icon: UserGroupIcon, current: location.pathname === '/agents' },
        { name: 'MCP', href: '/mcp', icon: ServerIcon, current: location.pathname === '/mcp' },
        { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, current: location.pathname === '/settings' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                w-64 bg-white dark:bg-gray-800 border-r-4 border-red-500
                lg:block lg:static
                ${isOpen ? 'fixed inset-y-0 left-0 z-50 translate-x-0' : 'fixed inset-y-0 left-0 z-50 -translate-x-full lg:translate-x-0'}
                transition-transform duration-300 ease-in-out
            `}>
                {/* Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-sm">DA</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                            Decentralized Agents
                        </span>
                    </div>
                    {/* Close button - only visible on mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
                    >
                        <div className="w-5 h-5 flex items-center justify-center">
                            <XMarkIcon className="w-5 h-5" />
                        </div>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-8 px-4">
                    <div className="space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    item.current
                                        ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-r-2 border-purple-500'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                }`}
                                onClick={() => {
                                    // Close sidebar on mobile after navigation
                                    if (window.innerWidth < 1024) {
                                        onClose();
                                    }
                                }}
                            >
                                <div className="w-5 h-5 flex items-center justify-center mr-3">
                                    <item.icon 
                                        className={`w-5 h-5 transition-colors duration-200 ${
                                            item.current
                                                ? 'text-purple-500 dark:text-purple-400'
                                                : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                                        }`}
                                    />
                                </div>
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        <p>v1.0.0</p>
                        <p className="mt-1">Decentralized Agents</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
