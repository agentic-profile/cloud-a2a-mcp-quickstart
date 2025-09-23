import { useState } from 'react';
import { Page, Card, CardBody, JsonRpcDebug, LabelValue } from '@/components';
import { WalletIcon } from '@heroicons/react/24/outline';
import { useSettingsStore } from '@/stores';
import { buildEndpoint } from '@/tools/misc';
import DeleteWalletItem from './DeleteWalletItem';
import UpdateWalletItem from './UpdateWalletItem';
import ReadWalletItem from './ReadWalletItem';
import PresentWalletItem from './PresentWalletItem';
import ListWalletItems from './ListWalletItems';
import McpWalletTools from './McpWalletTools';
import WalletItemKey from './WalletItemKey';
import { type HttpRequest } from '@/components/JsonRpcDebug';


const McpWalletPage = () => {
    const { serverUrl } = useSettingsStore();
    const [walletItemKey, setWalletItemKey] = useState<string>('default');
    const [httpRequest, setHttpRequest] = useState<HttpRequest | null>(null);

    // Construct the MCP endpoint URL
    const mcpEndpoint = buildEndpoint(serverUrl, 'mcp/wallet');

    const handleWalletItemKeyChange = (key: string) => {
        setWalletItemKey(key);
    };

    const clearResults = () => {
        setHttpRequest(null);
    };

    return (
        <Page
            title="Wallet MCP Service"
            subtitle="Manage verifiable credentials and digital wallet items"
        >
            {/* Service Information */}
            <Card className="mb-6">
                <CardBody>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
                            <WalletIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">Wallet MCP Service</h3>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                        <LabelValue label="Endpoint" value={mcpEndpoint} />
                        <p>
                            <strong>Available Tools:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li><strong>update:</strong> Create or update a wallet item with credentials</li>
                            <li><strong>read:</strong> Retrieve a wallet item by key</li>
                            <li><strong>list:</strong> List all wallet items owned by the current user</li>
                            <li><strong>present:</strong> Present a credential from the wallet as a verifiable presentation</li>
                            <li><strong>delete:</strong> Delete a wallet item by key</li>
                        </ul>
                        <p>
                            <strong>Data Format:</strong> Wallet items contain a unique key and credential data. Credentials can be any JSON object, typically following W3C Verifiable Credentials standards.
                        </p>
                    </div>
                </CardBody>
            </Card>

            {/* Wallet Item Key */}
            <WalletItemKey 
                walletItemKey={walletItemKey}
                onWalletItemKeyChange={handleWalletItemKeyChange}
            />

            <div className="grid gap-6 lg:grid-cols-5 items-start">
                {/* Left Column - Create/Update and Present */}
                <div className="flex flex-col gap-6 lg:col-span-3">
                    <UpdateWalletItem 
                        walletItemKey={walletItemKey}
                        onSubmitHttpRequest={setHttpRequest} 
                    />
                    <PresentWalletItem 
                        walletItemKey={walletItemKey}
                        onSubmitHttpRequest={setHttpRequest}
                    />
                </div>

                {/* Right Column - Wallet Operations */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                    {/* List Wallet Items */}
                    <ListWalletItems onSubmitHttpRequest={setHttpRequest} />

                    {/* Read Wallet Item */}
                    <ReadWalletItem 
                        walletItemKey={walletItemKey}
                        onSubmitHttpRequest={setHttpRequest}
                    />

                    {/* Delete Wallet Item */}
                    <DeleteWalletItem 
                        walletItemKey={walletItemKey}
                        onSubmitHttpRequest={setHttpRequest} 
                    />

                    {/* MCP Wallet Tools */}
                    <McpWalletTools onSubmitHttpRequest={setHttpRequest} />
                </div>
            </div>

            {/* JsonRpcDebug Component */}
            {httpRequest && (
                <div className="mt-6">
                    <JsonRpcDebug
                        url={mcpEndpoint}
                        httpRequest={httpRequest}
                        onClose={clearResults}
                    />
                </div>
            )}
        </Page>
    );
};

export default McpWalletPage;
