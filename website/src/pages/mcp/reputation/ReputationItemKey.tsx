import { useState } from 'react';
import { Card, CardBody, Button } from '@/components';
import { KeyIcon } from '@heroicons/react/24/outline';

interface ReputationItemKeyProps {
    reputationItemKey: string;
    onReputationItemKeyChange: (key: string) => void;
}

const ReputationItemKey = ({ reputationItemKey, onReputationItemKeyChange }: ReputationItemKeyProps) => {
    const [inputKey, setInputKey] = useState<string>(reputationItemKey);

    const handleKeyChange = (newKey: string) => {
        setInputKey(newKey);
        onReputationItemKeyChange(newKey);
    };

    const handleExampleClick = (exampleKey: string) => {
        handleKeyChange(exampleKey);
    };

    return (
        <Card className="mb-6">
            <CardBody>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
                        <KeyIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Reputation Item Key</h3>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Set the key for reputation operations. This key will be used for create, read, and delete operations.
                </p>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="reputationKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Reputation Item Key
                        </label>
                        <input
                            id="reputationKey"
                            type="text"
                            value={inputKey}
                            onChange={(e) => setInputKey(e.target.value)}
                            onBlur={() => handleKeyChange(inputKey)}
                            placeholder="my-review-2024"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Unique key for this reputation item (per reporter)</p>
                    </div>
                    
                    <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example Keys:</p>
                        <div className="flex flex-wrap gap-2">
                            {EXAMPLE_KEYS.map((example, index) => (
                                <Button
                                    key={index}
                                    onClick={() => handleExampleClick(example)}
                                    variant="secondary"
                                    size="sm"
                                    className="text-xs"
                                >
                                    {example}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default ReputationItemKey;

const EXAMPLE_KEYS = [
    'service-review-2024',
    'product-rating-jan',
    'collaboration-feedback',
    'professional-recommendation',
    'project-testimonial',
    'vendor-review-q1'
];
