import { forwardRef } from 'react';

interface CustomSwitchProps {
    isSelected?: boolean;
    onValueChange?: (value: boolean) => void;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    disabled?: boolean;
}

export const Switch = forwardRef<HTMLButtonElement, CustomSwitchProps>(
    ({ 
        isSelected = false, 
        onValueChange, 
        color = 'primary', 
        size = 'md', 
        className = '',
        disabled = false 
    }, ref) => {
        const handleToggle = () => {
            if (!disabled && onValueChange) {
                onValueChange(!isSelected);
            }
        };

        const getColorClasses = () => {
            if (disabled) return 'bg-gray-300 dark:bg-gray-600';
            
            switch (color) {
                case 'primary':
                    return isSelected 
                        ? 'bg-dodgerblue dark:bg-dodgerblue' 
                        : 'bg-gray-200 dark:bg-gray-700';
                case 'secondary':
                    return isSelected 
                        ? 'bg-purple-500 dark:bg-purple-500' 
                        : 'bg-gray-200 dark:bg-gray-700';
                case 'success':
                    return isSelected 
                        ? 'bg-green-500 dark:bg-green-500' 
                        : 'bg-gray-200 dark:bg-gray-700';
                case 'warning':
                    return isSelected 
                        ? 'bg-yellow-500 dark:bg-yellow-500' 
                        : 'bg-gray-200 dark:bg-gray-700';
                case 'danger':
                    return isSelected 
                        ? 'bg-red-500 dark:bg-red-500' 
                        : 'bg-gray-200 dark:bg-gray-700';
                default:
                    return isSelected 
                        ? 'bg-dodgerblue dark:bg-dodgerblue' 
                        : 'bg-gray-200 dark:bg-gray-700';
            }
        };

        const getOutlineClasses = () => {
            if (disabled) return 'border-gray-300 dark:border-gray-600';
            
            switch (color) {
                case 'primary':
                    return isSelected 
                        ? 'border-dodgerblue dark:border-dodgerblue' 
                        : 'border-gray-300 dark:border-gray-600';
                case 'secondary':
                    return isSelected 
                        ? 'border-purple-500 dark:border-purple-500' 
                        : 'border-gray-300 dark:border-gray-600';
                case 'success':
                    return isSelected 
                        ? 'border-green-500 dark:border-green-500' 
                        : 'border-gray-300 dark:border-gray-600';
                case 'warning':
                    return isSelected 
                        ? 'border-yellow-500 dark:border-yellow-500' 
                        : 'border-gray-300 dark:border-gray-600';
                case 'danger':
                    return isSelected 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600';
                default:
                    return isSelected 
                        ? 'border-dodgerblue dark:border-dodgerblue' 
                        : 'border-gray-300 dark:border-gray-600';
            }
        };

        const getSizeClasses = () => {
            switch (size) {
                case 'sm':
                    return 'w-9 h-5';
                case 'md':
                    return 'w-11 h-6';
                case 'lg':
                    return 'w-14 h-7';
                default:
                    return 'w-11 h-6';
            }
        };

        const getThumbSizeClasses = () => {
            switch (size) {
                case 'sm':
                    return 'w-4 h-4';
                case 'md':
                    return 'w-5 h-5';
                case 'lg':
                    return 'w-6 h-6';
                default:
                    return 'w-5 h-5';
            }
        };

        const getThumbPosition = () => {
            switch (size) {
                case 'sm':
                    return isSelected ? 'translate-x-4' : 'translate-x-0';
                case 'md':
                    return isSelected ? 'translate-x-5' : 'translate-x-0';
                case 'lg':
                    return isSelected ? 'translate-x-7' : 'translate-x-0';
                default:
                    return isSelected ? 'translate-x-5' : 'translate-x-0';
            }
        };

        return (
            <button
                ref={ref}
                type="button"
                role="switch"
                aria-checked={isSelected}
                disabled={disabled}
                onClick={handleToggle}
                className={`
                    relative inline-flex items-center rounded-full transition-all duration-300 ease-in-out 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dodgerblue 
                    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
                    border-2 ${getOutlineClasses()}
                    ${getSizeClasses()}
                    ${getColorClasses()}
                    ${className}
                `}
            >
                <span
                    className={`
                        inline-block transform transition-all duration-300 ease-in-out 
                        rounded-full bg-white shadow-md border border-gray-200
                        ${getThumbSizeClasses()}
                        ${getThumbPosition()}
                    `}
                />
            </button>
        );
    }
);

Switch.displayName = 'Switch';
