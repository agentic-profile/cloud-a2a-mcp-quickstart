import { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

interface EditableUrlProps {
    label: string;
    value: string | null;
    placeholder?: string;
    onUpdate: (newValue: string) => void;
}

export const EditableUrl = ({ label, value, placeholder, onUpdate }: EditableUrlProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editableValue, setEditableValue] = useState('');

    const handleEdit = () => {
        setEditableValue(value || '');
        setIsEditing(true);
    };

    const handleSave = () => {
        if (editableValue.trim()) {
            onUpdate(editableValue.trim());
        }
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

    if (!value && !isEditing) {
        return null;
    }

    return (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {label}:
                </span>
                {!isEditing && (
                    <button
                        onClick={handleEdit}
                        className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                    >
                        <PencilIcon className="h-3 w-3" />
                        <span>Edit</span>
                    </button>
                )}
            </div>
            
            {isEditing ? (
                <div className="space-y-3">
                    <input
                        type="text"
                        value={editableValue}
                        onChange={(e) => setEditableValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder || "Enter URL..."}
                        className="w-full px-3 py-2 text-sm border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                    />
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
                <code className="text-sm text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 px-3 py-2 rounded block break-all">
                    {value}
                </code>
            )}
        </div>
    );
};
