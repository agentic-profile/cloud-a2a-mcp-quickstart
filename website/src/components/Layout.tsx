import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopNavigation from './TopNavigation';
import BottomNavigation from './BottomNavigation';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    // Handle responsive behavior
    useEffect(() => {
        const checkIsMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarOpen(false); // Hide sidebar on mobile
            }
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [location.pathname, isMobile]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 text-gray-900 dark:text-white transition-colors duration-300">
            {/* Top Navigation - Always visible */}
            <TopNavigation 
                onSidebarToggle={setSidebarOpen}
                sidebarOpen={sidebarOpen}
            />

            {/* Main Content Area */}
            <div className="flex">
                {/* Sidebar - Always rendered, positioned absolutely on mobile, statically on desktop */}
                <Sidebar 
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                {/* Main Content - Takes remaining space */}
                <div className="flex-1 min-w-0">
                    {/* Content with bottom padding for mobile navigation */}
                    <div className="pb-20 md:pb-0">
                        {children}
                    </div>
                </div>
            </div>

            {/* Bottom Navigation - Only on mobile */}
            <BottomNavigation />
        </div>
    );
};

export default Layout;
