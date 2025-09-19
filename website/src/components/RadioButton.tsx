import React from 'react';

interface RadioButtonProps {
    name: string;
    value: string | null;
    checked: boolean;
    onChange: (value: string | null) => void;
    className?: string;
    disabled?: boolean;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ 
    name, 
    value, 
    checked, 
    onChange, 
    className = "",
    disabled = false 
}) => {
    return (
        <input
            type="radio"
            name={name}
            value={value || ''}
            checked={checked}
            disabled={disabled}
            onChange={() => onChange(value ?? null)}
            className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 focus:ring-offset-0 dark:bg-gray-700 dark:border-gray-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        />
    );
};
