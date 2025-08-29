import { forwardRef } from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ 
        variant = 'primary', 
        size = 'md', 
        loading = false,
        className = '',
        disabled,
        children,
        ...props 
    }, ref) => {
        const getVariantClasses = () => {
            switch (variant) {
                case 'primary':
                    return 'bg-dodgerblue hover:bg-blue-600 text-white border-transparent focus:ring-dodgerblue';
                case 'secondary':
                    return 'bg-gray-500 hover:bg-gray-600 text-white border-transparent focus:ring-gray-500';
                case 'success':
                    return 'bg-green-500 hover:bg-green-600 text-white border-transparent focus:ring-green-500';
                case 'warning':
                    return 'bg-yellow-500 hover:bg-yellow-600 text-white border-transparent focus:ring-yellow-500';
                case 'danger':
                    return 'bg-red-500 hover:bg-red-600 text-white border-transparent focus:ring-red-500';
                case 'ghost':
                    return 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
                default:
                    return 'bg-dodgerblue hover:bg-blue-600 text-white border-transparent focus:ring-dodgerblue';
            }
        };

        const getSizeClasses = () => {
            switch (size) {
                case 'sm':
                    return 'px-3 py-1.5 text-sm';
                case 'md':
                    return 'px-4 py-2 text-sm';
                case 'lg':
                    return 'px-6 py-3 text-base';
                default:
                    return 'px-4 py-2 text-sm';
            }
        };

        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                disabled={isDisabled}
                className={clsx(
                    'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'border-2',
                    getVariantClasses(),
                    getSizeClasses(),
                    className
                )}
                {...props}
            >
                {loading && (
                    <svg 
                        className="animate-spin -ml-1 mr-2 h-4 w-4" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                    >
                        <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                        />
                        <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
