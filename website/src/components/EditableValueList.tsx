import { Button } from '@/components';
import { PlusIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
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
            i === index ? {text} : value
        );
        onUpdate?.(newValues, selected);
    };

    const setSelectedValue = (index: number) => {
        onUpdate?.(values, index);
    };

    return (
        <div className={className}>
            {values?.map((value, index) => (
                <div
                    key={index}
                    className={clsx(
                        "flex items-center gap-3 p-3 transition-colors",
                        selectable && selected === index 
                            ? "bg-yellow-50 dark:bg-yellow-900/20" 
                            : "" //bg-white dark:bg-transparent"
                    )}
                >
                    {selectable && <button
                        onClick={() => setSelectedValue(index)}
                        className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        title={selected === index ? "Remove selection" : "Select this value"}
                    >
                        {selected === index ? (
                            <StarIconSolid className="w-5 h-5 text-yellow-500" />
                        ) : (
                            <StarIcon className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                        )}
                    </button>}

                    <input
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        value={value.text}
                        onChange={(e) => updateValue(index, e.target.value)}
                        placeholder={placeholder}
                        className={clsx(
                            "flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
                            "bg-transparent border-gray-300 dark:border-gray-500",
                            "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        )}
                    />

                    {values.length > 1 && (
                        <button
                            onClick={() => deleteValue(index)}
                            className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                            title="Delete value"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ))}

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
        </div>
    );
};
