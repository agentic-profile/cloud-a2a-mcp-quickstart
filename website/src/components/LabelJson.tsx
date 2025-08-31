import React from 'react';

interface LabelJsonProps {
    label: string;
    data: any;
    className?: string;
    preClassName?: string;
    variant?: 'default' | 'success' | 'failure';
}

export const LabelJson: React.FC<LabelJsonProps> = ({ 
    label, 
    data, 
    className = '',
    variant = 'default'
}) => {
    const formatJson = (data: any): string => {
        try {
            return JSON.stringify(data, null, 4);
        } catch {
            return String(data);
        }
    };

    const getVariantClasses = () => {
        switch (variant) {
            case 'success':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
            case 'failure':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
            default:
                return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700';
        }
    };

    const preClassName = `p-3 rounded-md text-xs overflow-x-auto border ${getVariantClasses()}`;

    return (
        <div className={className}>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {label}:
            </div>
            <pre className={preClassName}>
                {formatJson(data)}
            </pre>
        </div>
    );
};
