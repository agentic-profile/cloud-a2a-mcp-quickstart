import { useState } from 'react';
import { Card, CardBody, Button, HttpProgressSummary } from '@/components';
import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { type HttpProgress, type HttpRequest } from '@/components/JsonRpcDebug';

interface PresentWalletItemProps {
    walletItemKey: string;
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const PresentWalletItem = ({ walletItemKey, onSubmitHttpRequest }: PresentWalletItemProps) => {
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);

    const handleWalletPresent = () => {
        const mcpRequest = {
            method: "tools/call",
            params: {
                name: "present",
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
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <PresentationChartLineIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Present Credential</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Present the credential as a verifiable presentation with metadata.
                </p>
                
                <Button
                    onClick={handleWalletPresent}
                    className="w-full"
                    color="secondary"
                >
                    Present Credential
                </Button>

                <HttpProgressSummary progress={httpProgress} />
            </CardBody>
        </Card>
    );
};

export default PresentWalletItem;
