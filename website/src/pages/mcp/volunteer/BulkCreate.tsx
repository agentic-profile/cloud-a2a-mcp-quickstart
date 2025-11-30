import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { McpToolCallCard } from '@/components';

interface BulkCreateProps {
    onSubmitHttpRequest: (request: any) => void;
}

const BulkCreate = ({ onSubmitHttpRequest }: BulkCreateProps) => {
    const [fieldOptionality, setFieldOptionality] = useState<string>('0.0');
    const [limit, setLimit] = useState<string>('100');

    const createMcpRequest = () => {
        const fieldOptionalityNum = parseFloat(fieldOptionality);
        if (isNaN(fieldOptionalityNum) || fieldOptionalityNum < 0 || fieldOptionalityNum > 1) {
            return undefined;
        }

        const limitNum = parseInt(limit);
        if (isNaN(limitNum) || limitNum < 1) {
            return undefined;
        }

        return {
            method: 'tools/call',
            params: {
                name: 'bulk-create',
                arguments: {
                    limit: limitNum,
                    fieldOptionality: fieldOptionalityNum
                }
            }
        };
    };

    return (
        <McpToolCallCard
            title="Bulk Create Volunteers"
            icon={<PlusIcon className="w-5 h-5 text-white" />}
            buttonText="Bulk Create"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        >
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Limit
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        placeholder="Enter limit (minimum 1)"
                        className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent border-blue-300 dark:border-blue-600 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Maximum number of volunteers to create
                    </p>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Field Optionality (0.0 - 1.0)
                    </label>
                    <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={fieldOptionality}
                        onChange={(e) => setFieldOptionality(e.target.value)}
                        placeholder="Enter field optionality (0.0 - 1.0)"
                        className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:border-transparent border-blue-300 dark:border-blue-600 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Controls the probability that fields will be excluded in generated volunteers (0.0 = never, 1.0 = always)
                    </p>
                </div>
            </div>
        </McpToolCallCard>
    );
};

export default BulkCreate;

