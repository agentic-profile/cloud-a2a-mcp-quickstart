import { Button } from '@/components';
import { PlusIcon, TrashIcon, StarIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useRef } from 'react';
import { type AttributedString } from '@/stores/ventureStore';

interface EditableValueListProps {
    placeholder?: string;
    className?: string;
    values?: AttributedString[];
    selectable?: boolean;
    selected?: number;
    onUpdate?: (values: AttributedString[], selected: number) => void;
}

export const EditableValueList = ({ 
    placeholder = "Enter value...",
    className = "",
    values = [],
    selectable = false,
    selected = -1,
    onUpdate
}: EditableValueListProps) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const addValue = () => {
        const newValues = [...values, { text: '' }];
        const newIndex = newValues.length - 1;
        onUpdate?.(newValues, newIndex); // Select the newly added row
        
        // Focus the newly added input field after a short delay to ensure it's rendered
        setTimeout(() => {
            const inputElement = inputRefs.current[newIndex];
            if (inputElement) {
                inputElement.focus();
            }
        }, 0);
    };

    const deleteValue = (index: number) => {
        // Don't allow deleting if it would result in no values
        if (values.length <= 1) return;
        
        const newValues = values.filter((_, i) => i !== index);
        // Ensure we always have a selected row after deletion
        let newSelected = selected;
        if (selected === index) {
            // If deleting the selected row, select the previous row or first row
            newSelected = index > 0 ? index - 1 : 0;
        } else if (selected > index) {
            // If deleting a row before the selected one, adjust the index
            newSelected = selected - 1;
        }
        onUpdate?.(newValues, newSelected);
    };

    const updateValue = (index: number, text: string) => {
        const newValues = values.map((value, i) => 
            i === index ? { ...value, text } : value
        );
        onUpdate?.(newValues, selected);
    };

    const setSelectedValue = (index: number) => {
        onUpdate?.(values, index);
    };

    const toggleHidden = (index: number) => {
        const newValues = values.map((value, i) => 
            i === index ? { ...value, hidden: !value.hidden } : value
        );
        onUpdate?.(newValues, selected);
    };

    // Separate visible and hidden values
    const visibleValues = values.filter(value => !value.hidden);
    const hiddenValues = values.filter(value => value.hidden);

    return (
        <div className={className}>
            {/* Main list - only visible values */}
            {visibleValues?.map((value) => {
                // Find the original index in the full values array
                const originalIndex = values.findIndex(v => v === value);
                
                return (
                <div
                    key={originalIndex}
                    className={clsx(
                        "flex items-center gap-3 p-3 transition-colors",
                        selectable && selected === originalIndex 
                            ? "bg-yellow-50 dark:bg-yellow-900/20" 
                            : "" //bg-white dark:bg-transparent"
                    )}
                >
                    <button
                        onClick={() => toggleHidden(originalIndex)}
                        className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        title="Hide value"
                    >
                        <EyeIcon className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                    </button>

                    {selectable && <button
                        onClick={() => setSelectedValue(originalIndex)}
                        className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        title={selected === originalIndex ? "Remove selection" : "Select this value"}
                    >
                        {selected === originalIndex ? (
                            <StarIconSolid className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <StarIcon className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                        )}
                    </button>}

                    <input
                        ref={(el) => { inputRefs.current[originalIndex] = el; }}
                        type="text"
                        value={value.text}
                        onChange={(e) => updateValue(originalIndex, e.target.value)}
                        placeholder={placeholder}
                        className={clsx(
                            "flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
                            "bg-transparent border-gray-300 dark:border-gray-500",
                            "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        )}
                    />

                    {values.length > 1 && (
                        <button
                            onClick={() => deleteValue(originalIndex)}
                            className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                            title="Delete value"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
                );
            })}

            <div className="flex items-center justify-end mt-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addValue}
                    className="flex items-center gap-2 focus:ring-0 focus:ring-offset-0 focus:outline-none focus:ring-transparent"
                    style={{ outline: 'none' }}
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Value
                </Button>
            </div>

            {/* Hidden Values Section */}
            {hiddenValues.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Hidden Values ({hiddenValues.length})
                    </h3>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        {hiddenValues.map((value) => {
                            // Find the original index in the full values array
                            const originalIndex = values.findIndex(v => v === value);
                            
                            return (
                                <div
                                    key={originalIndex}
                                    className="flex items-center gap-3 p-3 mb-2 last:mb-0"
                                >
                                    <button
                                        onClick={() => toggleHidden(originalIndex)}
                                        className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                        title="Show value"
                                    >
                                        <EyeSlashIcon className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                                    </button>

                                    <input
                                        ref={(el) => { inputRefs.current[originalIndex] = el; }}
                                        type="text"
                                        value={value.text}
                                        onChange={(e) => updateValue(originalIndex, e.target.value)}
                                        placeholder={placeholder}
                                        className={clsx(
                                            "flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
                                            "bg-transparent border-gray-300 dark:border-gray-500",
                                            "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        )}
                                    />

                                    <button
                                        onClick={() => deleteValue(originalIndex)}
                                        className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                                        title="Delete value"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
