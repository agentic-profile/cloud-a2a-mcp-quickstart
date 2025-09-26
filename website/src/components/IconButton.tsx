import React from 'react';
import clsx from 'clsx';

interface IconButtonProps {
    icon: React.ReactNode;
    onClick?: () => void;
    className?: string;
    title?: string;
    variant?: 'default' | 'danger' | 'warning' | 'success';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}

export const IconButton = ({ 
    icon, 
    onClick, 
    className = '', 
    title,
    variant = 'default',
    size = 'md',
    disabled = false
}: IconButtonProps) => {
    const baseClasses = "flex-shrink-0 p-1 rounded-full transition-colors";
    
    const variantClasses = {
        default: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600",
        danger: "text-red-500 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20",
        warning: "text-yellow-500 hover:text-yellow-700 dark:hover:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20",
        success: "text-green-500 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
    };
    
    const sizeClasses = {
        sm: "p-0.5",
        md: "p-1", 
        lg: "p-1.5"
    };
    
    const iconSizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                baseClasses,
                sizeClasses[size],
                variantClasses[variant],
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            title={title}
        >
            <div className={iconSizeClasses[size]}>
                {icon}
            </div>
        </button>
    );
};
