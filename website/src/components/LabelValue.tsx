import React from 'react';

interface LabelValueProps {
    label: string;
    value: string | undefined;
    className?: string;
}

export const LabelValue: React.FC<LabelValueProps> = ({ label, value = '', className = '' }) => {
    return (
        <p className={className}>
            <strong>{label}:</strong> <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{value}</code>
        </p>
    );
};
