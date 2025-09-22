import { useState } from 'react';
import { Card, CardBody, Button, HttpProgressSummary } from '@/components';
import { ListBulletIcon } from '@heroicons/react/24/outline';
import { type HttpProgress, type HttpRequest } from '@/components/JsonRpcDebug';

interface ListWalletItemsProps {
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const ListWalletItems = ({ onSubmitHttpRequest }: ListWalletItemsProps) => {
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);

    const handleWalletList = () => {
        const mcpRequest = {
            method: "tools/call",
            params: {
                name: "list"
            }
        };

        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mcpRequest),
        };

        onSubmitHttpRequest({
            requestInit: request,
            onProgress: setHttpProgress
        });
    };

    return (
        <Card>
            <CardBody>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center">
                        <ListBulletIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">List My Wallet Items</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    View all wallet items you own with their keys, update timestamps, and credential status.
                </p>
                
                <Button
                    onClick={handleWalletList}
                    className="w-full sm:w-auto"
                    color="primary"
                >
                    <ListBulletIcon className="w-4 h-4 mr-2" />
                    List My Wallet Items
                </Button>

                <HttpProgressSummary progress={httpProgress} />
            </CardBody>
        </Card>
    );
};

export default ListWalletItems;
