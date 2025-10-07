import React from 'react';
import { RadioButton } from './RadioButton';

interface RadioOption {
    id: string;
    label: string;
    disabled?: boolean;
}

interface RadioGroupProps {
    name: string;
    options: RadioOption[];
    selectedValue: string;
    onChange: (value: string | null) => void;
    className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
    name,
    options,
    selectedValue,
    onChange,
    className = ""
}) => {
    return (
        <div className={`space-y-1 ${className}`}>
            {options.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                    <RadioButton
                        name={name}
                        value={option.id}
                        checked={selectedValue === option.id}
                        disabled={option.disabled}
                        onChange={onChange}
                    />
                    <span className="text-sm">{option.label}</span>
                </div>
            ))}
        </div>
    );
};
