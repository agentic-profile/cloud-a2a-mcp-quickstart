import { Link, useLocation } from 'react-router-dom';
import { 
    HomeIcon,
    UserGroupIcon,
    ServerIcon,
    Cog6ToothIcon
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

    const handleNavigation = () => {
        // Always close sidebar after navigation
        onClose();
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
                bg-white dark:bg-gray-800 border-r-1 border-gray-500
                transition-transform duration-300 ease-in-out
                w-full max-w-xs lg:w-56
                fixed inset-y-0 left-0 z-50
                ${isOpen 
                    ? 'translate-x-0' 
                    : '-translate-x-full'
                }
            `}>
                {/* Navigation */}
                <nav className="pt-8 px-4">
                    <div className="space-y-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    item.current
                                        ? 'bg-blue-100 dark:bg-blue-900/20 text-dodgerblue dark:text-dodgerblue border-r-2 border-dodgerblue'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                }`}
                                onClick={handleNavigation}
                            >
                                <div className="w-5 h-5 flex items-center justify-center mr-3">
                                    <item.icon 
                                                                            className={`w-5 h-5 transition-colors duration-200 ${
                                        item.current
                                            ? 'text-dodgerblue dark:text-dodgerblue'
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
                        <p className="mt-1">Agent World Congress</p>
                        <p className="mt-1 text-xs">
                            {typeof __BUILD_TIME__ !== 'undefined' 
                                ? new Date(__BUILD_TIME__).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })
                                : ''
                            }
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
