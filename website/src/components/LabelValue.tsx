import React from 'react';

interface LabelValueProps {
    label: string;
    value: string | undefined;
    className?: string;
    children?: React.ReactNode;
}

export const LabelValue: React.FC<LabelValueProps> = ({ label, value = '', className = '', children }) => {
    return (
        <p className={className}>
            <strong>{label}:</strong> <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{value}</code>
            {children}
        </p>
    );
};
