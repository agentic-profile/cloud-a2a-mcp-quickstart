import { useState } from 'react';
import { Page, Card, CardBody, Button, JsonRpcDebug, LabelValue } from '@/components';
import { WalletIcon, EyeIcon, PlusIcon, TrashIcon, PresentationChartLineIcon, ListBulletIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { useSettingsStore } from '@/stores';
import { buildEndpoint } from '@/tools/misc';

interface Result {
    fetchResponse: Response | undefined;
    text: string | undefined;
    data: any | undefined;
    error: unknown;
}

const McpWalletPage = () => {
    const { serverUrl } = useSettingsStore();
    const [walletKey, setWalletKey] = useState<string>('default');
    const [deleteKey, setDeleteKey] = useState<string>('');
    const [credentialData, setCredentialData] = useState<string>('{\n  "type": "VerifiableCredential",\n  "credentialSubject": {\n    "id": "did:example:123",\n    "name": "Example Credential"\n  }\n}');
    const [mcpRequest, setMcpRequest] = useState<RequestInit | null>(null);

    // Construct the MCP endpoint URL
    const mcpEndpoint = buildEndpoint(serverUrl, 'mcp/wallet');

    const handleWalletUpdate = () => {
        let parsedCredential;
        try {
            parsedCredential = JSON.parse(credentialData);
        } catch (error) {
            alert('Invalid JSON in credential data');
            return;
        }

        const mcpRequest = {
            method: "tools/call",
            params: {
                name: "update",
                item: {
                    key: walletKey,
                    credential: parsedCredential
                }
            }
        };

        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mcpRequest),
        };

        setMcpRequest(request);
    };

    const handleWalletRead = () => {
        const mcpRequest = {
            method: "tools/call",
            params: {
                name: "read",
                key: walletKey
            }
        };

        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mcpRequest),
        };

        setMcpRequest(request);
    };

    const handleWalletDelete = () => {
        if (!deleteKey.trim()) {
            alert('Please enter a wallet key to delete');
            return;
        }

        if (!confirm(`Are you sure you want to delete wallet item "${deleteKey}"?`)) {
            return;
        }

        const mcpRequest = {
            method: "tools/call",
            params: {
                name: "delete",
                key: deleteKey
            }
        };

        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mcpRequest),
        };

        setMcpRequest(request);
    };

    const handleWalletPresent = () => {
        const mcpRequest = {
            method: "tools/call",
            params: {
                name: "present",
                key: walletKey
            }
        };

        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mcpRequest),
        };

        setMcpRequest(request);
    };

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

        setMcpRequest(request);
    };

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

        setMcpRequest(request);
    };

    const clearResults = () => {
        setMcpRequest(null);
    };

    const handleMcpResult = (result: Result) => {
        // Handle the result from JsonRpcDebug if needed
        console.log('Wallet operation result:', result);
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

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Create/Update Wallet Item */}
                <Card className="lg:col-span-2">
                    <CardBody>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                                <PlusIcon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold">Create/Update Wallet Item</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="walletKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Wallet Key
                                </label>
                                <input
                                    id="walletKey"
                                    type="text"
                                    value={walletKey}
                                    onChange={(e) => setWalletKey(e.target.value)}
                                    placeholder="default"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 mt-1">Unique identifier for this wallet item</p>
                            </div>
                            
                            <div>
                                <label htmlFor="credentialData" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Credential Data (JSON)
                                </label>
                                <textarea
                                    id="credentialData"
                                    value={credentialData}
                                    onChange={(e) => setCredentialData(e.target.value)}
                                    rows={10}
                                    placeholder='{"type": "VerifiableCredential", "credentialSubject": {...}}'
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">JSON object containing the credential data</p>
                            </div>
                            
                            <Button
                                onClick={handleWalletUpdate}
                                className="w-full"
                                color="primary"
                            >
                                Create/Update Wallet Item
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Wallet Operations */}
                <div className="space-y-6">
                    {/* Read Wallet Item */}
                    <Card>
                        <CardBody>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                                    <EyeIcon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold">Read Wallet Item</h3>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                                Read the wallet item using the key specified above.
                            </p>
                            
                            <Button
                                onClick={handleWalletRead}
                                className="w-full"
                                color="success"
                            >
                                Read Wallet Item
                            </Button>
                        </CardBody>
                    </Card>

                    {/* Present Wallet Item */}
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
                        </CardBody>
                    </Card>

                    {/* Delete Wallet Item */}
                    <Card>
                        <CardBody>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
                                    <TrashIcon className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold">Delete Wallet Item</h3>
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                                Permanently delete the wallet item with the specified key.
                            </p>
                            
                            <div className="mb-4">
                                <label htmlFor="deleteKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Wallet Key to Delete
                                </label>
                                <input
                                    id="deleteKey"
                                    type="text"
                                    value={deleteKey}
                                    onChange={(e) => setDeleteKey(e.target.value)}
                                    placeholder="Enter wallet key"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 mt-1">Enter the key of the wallet item you want to delete</p>
                            </div>
                            
                            <Button
                                onClick={handleWalletDelete}
                                className="w-full"
                                color="danger"
                            >
                                Delete Wallet Item
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* List Wallet Items */}
            <Card className="mt-6">
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
                </CardBody>
            </Card>

            {/* MCP Wallet Tools */}
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
                </CardBody>
            </Card>

            {/* JsonRpcDebug Component */}
            {mcpRequest && (
                <div className="mt-6">
                    <JsonRpcDebug
                        url={mcpEndpoint}
                        request={mcpRequest}
                        onFinalResult={handleMcpResult}
                        onClose={clearResults}
                    />
                </div>
            )}
        </Page>
    );
};

export default McpWalletPage;
