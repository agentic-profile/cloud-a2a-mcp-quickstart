import React from 'react';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    className?: string;
    disabled?: boolean;
    id?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ 
    checked, 
    onChange, 
    label, 
    className = "",
    disabled = false,
    id 
}) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    return (
        <label className={`flex items-center space-x-2 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`} htmlFor={checkboxId}>
            <input
                type="checkbox"
                id={checkboxId}
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {label && (
                <span className="text-sm text-gray-700 dark:text-gray-300 select-none">
                    {label}
                </span>
            )}
        </label>
    );
};
