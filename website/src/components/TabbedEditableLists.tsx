import { useState } from 'react';
import { EditableValueList } from '@/components';
import clsx from 'clsx';

export interface TabValues {
    id: string;
    values: string[];
    selected: number;
}

interface TabbedEditableListsProps {
    tabs: Array<{
        id: string;
        title: string;
        placeholder?: string;
    }>;
    className?: string;
    values?: TabValues[];
    onUpdate?: (tabId: string, values: string[], selected: number) => void;
}

export const TabbedEditableLists = ({
    tabs,
    className = "",
    values = [],
    onUpdate
}: TabbedEditableListsProps) => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    if (!tabs || tabs.length === 0) {
        return null;
    }

    const { id, placeholder } = tabs[activeTabIndex];
    const { values: tabValues, selected }= values[activeTabIndex];

    return (
        <div className={className}>
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-600 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTabIndex(index)}
                            className={clsx(
                                "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                                activeTabIndex === index
                                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                            )}
                        >
                            {tab.title}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div>
                <EditableValueList
                    placeholder={placeholder ?? "Enter option..."}
                    className="border-0 shadow-none bg-transparent"
                    values={tabValues}
                    selected={selected}
                    onUpdate={(values, selected) => onUpdate?.(id, values, selected)}
                />
            </div>
        </div>
    );
};
