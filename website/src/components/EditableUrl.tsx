import { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';
import { Card, CardBody } from './Card';
import { validateHttpUrl } from '@/tools/misc';

interface EditableUrlProps {
    label: string;
    value: string | null | undefined;
    placeholder?: string;
    options?: string[];
    onUpdate: (newValue: string) => void;
}

export const EditableUrl = ({ label, value, placeholder, options, onUpdate }: EditableUrlProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableValue, setEditableValue] = useState('');
    const isValidValue = validateHttpUrl(value);
    const isValidEdit = validateHttpUrl(editableValue);
    
    // Show error variant when editing invalid URL with content, or when saved value is invalid with content
    const shouldShowError = isEditing ? !isValidEdit : !isValidValue;

    const handleEdit = () => {
        setEditableValue(value || '');
        setIsEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setEditableValue(newValue);
    };

    const handleSave = () => {
        onUpdate(editableValue.trim());
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditableValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const handleOptionSelect = (option: string) => {
        setEditableValue(option);
    };

    return (
        <Card 
            variant={shouldShowError ? "error" : "primary"}
            className="mb-4"
        >
            <CardBody>
                <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {label}:
                </span>
                {!isEditing && (
                    <button
                        onClick={handleEdit}
                        className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        <PencilIcon className="h-3 w-3" />
                        <span>Edit</span>
                    </button>
                )}
            </div>
            
            {isEditing ? (
                <div className="space-y-3">
                    <div>
                        <input
                            type="text"
                            value={editableValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholder || "Enter URL..."}
                            className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent ${
                                !isValidEdit && editableValue.trim() 
                                    ? 'border-red-500 focus:ring-red-500' 
                                    : 'border-blue-300 dark:border-blue-600 focus:ring-blue-500'
                            }`}
                            autoFocus
                        />
                        {!isValidEdit && editableValue.trim() && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                Please enter a valid URL
                            </p>
                        )}
                    </div>
                    {options && options.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Quick options:</p>
                            <div className="flex flex-wrap gap-2">
                                {options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionSelect(option)}
                                        className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                                            editableValue === option
                                                ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                                                : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex items-center space-x-2">
                        <Button
                            onClick={handleSave}
                            variant="primary"
                            className="text-xs px-3 py-1"
                        >
                            <CheckIcon className="h-3 w-3 mr-1" />
                            Save
                        </Button>
                        <Button
                            onClick={handleCancel}
                            variant="secondary"
                            className="text-xs px-3 py-1"
                        >
                            <XMarkIcon className="h-3 w-3 mr-1" />
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <div>
                    <input
                        type="text"
                        value={value || ''}
                        readOnly
                        className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:border-transparent focus:ring-blue-500"
                    />
                    {!isValidValue && value?.trim() && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                            Invalid URL format
                        </p>
                    )}
                </div>
            )}
            </CardBody>
        </Card>
    );
};
