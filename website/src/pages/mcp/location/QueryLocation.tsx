import { useState } from 'react';
import { Card, CardBody, Button, HttpProgressSummary } from '@/components';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { type HttpProgress, type HttpRequest } from '@/components/JsonRpcDebug';

interface QueryLocationProps {
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const QueryLocation: React.FC<QueryLocationProps> = ({ onSubmitHttpRequest }) => {
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);

    const handleLocationQuery = () => {
        const mcpRequest = {
            //jsonrpc: "2.0",
            //id: 1,
            method: "tools/call",
            params: {
                name: "query",
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
        <div>
            <Card>
                <CardBody>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                            <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">Query Location</h3>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Click the button below to query the current location data.
                    </p>
                    
                    <Button
                        onClick={handleLocationQuery}
                        className="w-full"
                        color="success"
                    >
                        Query Location
                    </Button>

                    <HttpProgressSummary progress={httpProgress} />
                </CardBody>
            </Card>
        </div>
    );
};

export default QueryLocation;
