import { Button, Card, CardBody } from '@/components';
import { PlusIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import clsx from 'clsx';

interface EditableValueListProps {
    title?: string;
    placeholder?: string;
    className?: string;
    values?: string[];
    selected?: number;
    onUpdate?: (values: string[], selected: number) => void;
}

export const EditableValueList = ({ 
    title = "Values", 
    placeholder = "Enter value...",
    className = "",
    values = [],
    selected = -1,
    onUpdate
}: EditableValueListProps) => {

    const addValue = () => {
        const newValues = [...values, ''];
        onUpdate?.(newValues, selected);
    };

    const deleteValue = (index: number) => {
        const newValues = values.filter((_, i) => i !== index);
        const newSelected = selected >= newValues.length ? -1 : selected;
        onUpdate?.(newValues, newSelected);
    };

    const updateValue = (index: number, text: string) => {
        const newValues = values.map((value, i) => 
            i === index ? text : value
        );
        onUpdate?.(newValues, selected);
    };

    const setSelectedValue = (index: number) => {
        onUpdate?.(values, index);
    };

    return (
        <Card className={clsx("mt-6", className)}>
            <CardBody>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={addValue}
                        className="flex items-center gap-2"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Add Value
                    </Button>
                </div>

                <div>
                    {values.map((value, index) => (
                        <div
                            key={index}
                            className={clsx(
                                "flex items-center gap-3 p-3 transition-colors",
                                selected === index 
                                    ? "bg-yellow-50 dark:bg-yellow-900/20" 
                                    : "bg-white dark:bg-gray-700"
                            )}
                        >
                            <button
                                onClick={() => setSelectedValue(index)}
                                className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                title={selected === index ? "Remove selection" : "Select this value"}
                            >
                                {selected === index ? (
                                    <StarIconSolid className="w-5 h-5 text-yellow-500" />
                                ) : (
                                    <StarIcon className="w-5 h-5 text-gray-400 hover:text-yellow-500" />
                                )}
                            </button>

                            <input
                                type="text"
                                value={value}
                                onChange={(e) => updateValue(index, e.target.value)}
                                placeholder={placeholder}
                                className={clsx(
                                    "flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
                                    "bg-transparent border-gray-300 dark:border-gray-500",
                                    "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                )}
                            />

                            <button
                                onClick={() => deleteValue(index)}
                                className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                                title="Delete value"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {values.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <p>No values yet. Click "Add Value" to get started.</p>
                        </div>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};
