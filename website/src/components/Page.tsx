import React from 'react';
import { ThemeToggle, PageHeader } from './index';

interface PageProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    showMobileThemeToggle?: boolean;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    showHeader?: boolean;
    headerContent?: React.ReactNode;
    footerContent?: React.ReactNode;
}

const Page: React.FC<PageProps> = ({
    children,
    title,
    subtitle,
    showMobileThemeToggle = false,
    className = '',
    maxWidth = '4xl',
    padding = 'lg',
    showHeader = true,
    headerContent,
    footerContent
}) => {
    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '4xl': 'max-w-4xl',
        '6xl': 'max-w-6xl',
        full: 'max-w-full'
    };

    const paddingClasses = {
        none: '',
        sm: 'px-2 py-4',
        md: 'px-4 py-6',
        lg: 'px-4 sm:px-6 lg:px-8 py-8'
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Mobile Theme Toggle - Top Right (optional) */}
            {showMobileThemeToggle && (
                <div className="lg:hidden fixed top-4 right-4 z-50">
                    <ThemeToggle />
                </div>
            )}

            {/* Page Container */}
            <div className={`mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses[padding]}`}>
                {/* Header Section */}
                {showHeader && (title || subtitle || headerContent) && (
                    <div className="mb-8">
                        {headerContent ? (
                            headerContent
                        ) : (
                            <PageHeader 
                                title={title || ''} 
                                subtitle={subtitle}
                            />
                        )}
                    </div>
                )}

                {/* Main Content */}
                <div className="flex-1">
                    {children}
                </div>

                {/* Footer Content (optional) */}
                {footerContent && (
                    <div className="mt-8">
                        {footerContent}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
