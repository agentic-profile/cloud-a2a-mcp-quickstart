import { useState } from 'react';
import { Card, CardBody, Button, HttpProgressSummary } from '@/components';
import { EyeIcon } from '@heroicons/react/24/outline';
import { type HttpProgress, type HttpRequest } from '@/components/JsonRpcDebug';

interface ReadWalletItemProps {
    walletItemKey: string;
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const ReadWalletItem = ({ walletItemKey, onSubmitHttpRequest }: ReadWalletItemProps) => {
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);

    const handleWalletRead = () => {
        const mcpRequest = {
            method: "tools/call",
            params: {
                name: "read",
                key: walletItemKey
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
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                        <EyeIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Read Wallet Item</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Read the wallet item using the key from the update form above.
                </p>
                
                <Button
                    onClick={handleWalletRead}
                    className="w-full"
                    color="success"
                >
                    Read Wallet Item
                </Button>

                <HttpProgressSummary progress={httpProgress} />
            </CardBody>
        </Card>
    );
};

export default ReadWalletItem;
