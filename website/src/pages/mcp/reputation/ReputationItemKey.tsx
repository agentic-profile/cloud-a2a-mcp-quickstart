import { Card, CardBody } from '@/components';
import { KeyIcon } from '@heroicons/react/24/outline';

interface ReputationItemKeyProps {
    reputationItemKey: string;
    onReputationItemKeyChange: (key: string) => void;
}

const ReputationItemKey = ({ reputationItemKey, onReputationItemKeyChange }: ReputationItemKeyProps) => {
    return (
        <Card className="mb-6">
            <CardBody>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <KeyIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-0">Reputation Item Key</h3>
                    <div className="flex-1 flex items-center">
                        <input
                            id="centralReputationKey"
                            type="text"
                            value={reputationItemKey}
                            onChange={(e) => onReputationItemKeyChange(e.target.value)}
                            placeholder="default"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Set the reputation item id/key that will be used for all reputation operations below. Each key must be unique in your reputation reports.
                </p>
            </CardBody>
        </Card>
    );
};

export default ReputationItemKey;
