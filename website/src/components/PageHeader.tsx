import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    showBackArrow?: boolean; // Keep for manual override
    className?: string;
}

export const PageHeader = ({ 
    title, 
    subtitle, 
    showBackArrow,
    className = "" 
}: PageHeaderProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [canGoBack, setCanGoBack] = useState(false);

    // Check if we can go back by looking at navigation history
    useEffect(() => {
        // Check if there's a previous page in the history
        const checkCanGoBack = () => {
            // If showBackArrow is explicitly set, use that value
            if (showBackArrow !== undefined) {
                setCanGoBack(showBackArrow);
                return;
            }
            
            // Otherwise, check if we're not on the home page and have navigation history
            const isHomePage = location.pathname === '/';
            const hasHistory = window.history.length > 1;
            
            setCanGoBack(!isHomePage && hasHistory);
        };

        checkCanGoBack();
    }, [location.pathname, showBackArrow]);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={`mb-6 ${className}`}>
            <div className="flex items-center gap-3">
                {canGoBack && (
                    <button
                        onClick={handleBack}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        aria-label="Go back"
                    >
                        <ChevronLeftIcon className="w-7 h-7 text-gray-600 dark:text-gray-400" />
                    </button>
                )}
                <h1 className="mb-0">
                    {title}
                </h1>
            </div>
            {subtitle && (
                <div className="mt-2 ml-14">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subtitle}
                    </p>
                </div>
            )}
        </div>
    );
};
