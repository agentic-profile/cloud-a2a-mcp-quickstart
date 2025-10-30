import { Button, IconButton } from '@/components';
import { PlusIcon, TrashIcon, StarIcon, EyeIcon, EyeSlashIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { useRef, useEffect, useState } from 'react';
import { type AttributedString } from '@/stores/venture-types';

interface EditableValueListProps {
    placeholder?: string;
    className?: string;
    eyes?: boolean;
    values?: AttributedString[];
    selectable?: boolean;
    selected?: number;
    onUpdate?: (values: AttributedString[], selected: number) => void;
}

export const EditableValueList = ({ 
    placeholder = "Enter value...",
    className = "",
    eyes = true,
    values = [],
    selectable = false,
    selected = -1,
    onUpdate
}: EditableValueListProps) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    if( !Array.isArray(values) )
        values = []; // failsafe

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

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', '');
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = () => {
        setDragOverIndex(null);
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        
        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }

        const newValues = [...values];
        const draggedItem = newValues[draggedIndex];
        
        // Remove the dragged item
        newValues.splice(draggedIndex, 1);
        
        // Insert at the new position
        newValues.splice(dropIndex, 0, draggedItem);
        
        // Update selected index if needed
        let newSelected = selected;
        if (selected === draggedIndex) {
            newSelected = dropIndex;
        } else if (draggedIndex < selected && dropIndex >= selected) {
            newSelected = selected - 1;
        } else if (draggedIndex > selected && dropIndex <= selected) {
            newSelected = selected + 1;
        }
        
        onUpdate?.(newValues, newSelected);
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    // Separate visible and hidden values
    const visibleValues = values.filter(value => !value.hidden);
    const hiddenValues = values.filter(value => value.hidden);
    
    // Ensure there's always at least one visible field
    useEffect(() => {
        if (visibleValues.length === 0) {
            // If no visible fields, add a new empty visible field
            const newValues = [...values, { text: '' }];
            onUpdate?.(newValues, newValues.length - 1);
        }
    }, [visibleValues.length, values, onUpdate]);

    return (
        <div className={className}>
            {/* Main list - only visible values */}
            {visibleValues?.map((value) => {
                // Find the original index in the full values array
                const originalIndex = values.findIndex(v => v === value);
                const isDragging = draggedIndex === originalIndex;
                const isDragOver = dragOverIndex === originalIndex;
                
                return (
                <div
                    key={originalIndex}
                    onDragOver={(e) => handleDragOver(e, originalIndex)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, originalIndex)}
                    className={clsx(
                        "flex items-center gap-3 p-2 transition-all duration-200",
                        selectable && selected === originalIndex 
                            ? "bg-yellow-50 dark:bg-yellow-900/20" 
                            : "",
                        isDragging && "opacity-50 scale-95",
                        isDragOver && "border-t-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    )}
                >
                    {visibleValues.length > 1 && (
                        <div 
                            className="cursor-grab active:cursor-grabbing"
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, originalIndex)}
                            onDragEnd={handleDragEnd}
                        >
                            <Bars3Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        </div>
                    )}

                    {eyes && <IconButton
                        icon={<EyeSlashIcon />}
                        onClick={() => toggleHidden(originalIndex)}
                        title="Hide value"
                    />}

                    {selectable && <IconButton
                        icon={selected === originalIndex ? <StarIconSolid /> : <StarIcon />}
                        onClick={() => setSelectedValue(originalIndex)}
                        variant={selected === originalIndex ? "warning" : "default"}
                        title={selected === originalIndex ? "Remove selection" : "Select this value"}
                    />}

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

                    {visibleValues.length > 1 && (
                        <IconButton
                            icon={<TrashIcon />}
                            onClick={() => deleteValue(originalIndex)}
                            variant="danger"
                            title="Delete value"
                        />
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
                <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                    <h4>Hidden Values</h4>
                    {hiddenValues.map((value) => {
                        // Find the original index in the full values array
                        const originalIndex = values.findIndex(v => v === value);
                        
                        return (
                            <div
                                key={originalIndex}
                                className="flex items-center gap-3 p-2"
                            >
                                <IconButton
                                    icon={<EyeIcon />}
                                    onClick={() => toggleHidden(originalIndex)}
                                    title="Show value"
                                />

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

                                <IconButton
                                    icon={<TrashIcon />}
                                    onClick={() => deleteValue(originalIndex)}
                                    variant="danger"
                                    title="Delete value"
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
