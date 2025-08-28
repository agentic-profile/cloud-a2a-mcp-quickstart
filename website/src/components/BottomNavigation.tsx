import { useLocation, Link } from 'react-router-dom';
import { 
    HomeIcon,
    UserGroupIcon,
    ServerIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline';

const BottomNavigation = () => {
    const location = useLocation();

    const navigation = [
        { name: 'Home', href: '/', icon: HomeIcon, current: location.pathname === '/' },
        { name: 'Agents', href: '/agents', icon: UserGroupIcon, current: location.pathname === '/agents' },
        { name: 'MCP', href: '/mcp', icon: ServerIcon, current: location.pathname === '/mcp' },
        { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, current: location.pathname === '/settings' },
    ];

    return (
        <nav className="block lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t-4 border-green-500 z-50 w-full max-w-full overflow-hidden">
            <div className="flex justify-around w-full">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 transition-colors duration-200 ${
                            item.current
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        <div className="w-6 h-6 flex items-center justify-center">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium truncate mt-1">{item.name}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default BottomNavigation;
