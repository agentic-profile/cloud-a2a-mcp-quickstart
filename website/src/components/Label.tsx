import React from 'react';

interface LabelProps {
    label: string;
    className?: string;
    required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ 
    label, 
    className = '', 
    required = false 
}) => {
    return (
        <label className={`mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300 ${className}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
};

