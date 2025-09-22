import { useState } from 'react';
import { Card, CardBody, Button, HttpProgressSummary } from '@/components';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { type HttpProgress, type HttpRequest } from '@/components/JsonRpcDebug';

interface McpWalletToolsProps {
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const McpWalletTools = ({ onSubmitHttpRequest }: McpWalletToolsProps) => {
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);

    const handleToolsList = () => {
        const mcpRequest = {
            method: "tools/list",
            params: {}
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
        <Card className="mt-6">
            <CardBody>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                        <WrenchScrewdriverIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">MCP Wallet Tools</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    View the available MCP tools for the wallet service, including their descriptions and input schemas.
                </p>
                
                <Button
                    onClick={handleToolsList}
                    className="w-full sm:w-auto"
                    color="warning"
                >
                    <WrenchScrewdriverIcon className="w-4 h-4 mr-2" />
                    List MCP Wallet Tools
                </Button>

                <HttpProgressSummary progress={httpProgress} />
            </CardBody>
        </Card>
    );
};

export default McpWalletTools;
