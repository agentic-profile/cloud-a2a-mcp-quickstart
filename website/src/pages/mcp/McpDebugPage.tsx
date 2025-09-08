import { useState } from 'react';
import { Page, JsonRpcDebug, Card, CardBody, Button, EditableUrl } from '@/components';
import { useRpcUrlFromWindow, updateWindowRpcUrl, DEFAULT_SERVER_URLS } from '@/tools/misc';

const URL_OPTIONS = DEFAULT_SERVER_URLS.map(url => url+'/mcp/location');

export interface McpRequest {
    jsonrpc: '2.0';
    id: string;
    method: string;
    params?: any;
}

const McpDebugPage = () => {
    const rpcUrl = useRpcUrlFromWindow();
    const [customPayload, setCustomPayload] = useState<string>('{\n  "method": "tools/list",\n  "params": {\n    "name": "test"\n  }\n}');
    const [request, setRequest] = useState<RequestInit | null>(null);

    const handlePayloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCustomPayload(e.target.value);
    };


    const handleResult = (result: any) => {
        console.log('JSON RPC Result:', result);
    };

    const getParsedPayload = () => {
        try {
            return JSON.parse(customPayload);
        } catch (error) {
            return { error: 'Invalid JSON' };
        }
    };

    const isValidJson = () => {
        try {
            JSON.parse(customPayload);
            return true;
        } catch {
            return false;
        }
    };

    const isValidUrl = () => {
        if (!rpcUrl)
            return false;

        try {
            new URL(rpcUrl);
            return true;
        } catch {
            return false;
        }
    };

    const handleSendRequest = () => {
        if (!rpcUrl?.trim()) {
            return;
        }

        if (!isValidUrl()) {
            return;
        }

        if (!isValidJson()) {
            return;
        }

        // Create the JSON RPC request
        const body = JSON.stringify({
            method: getParsedPayload().method || 'call',
            params: getParsedPayload().params || getParsedPayload()
        });

        // Set the request - this will automatically trigger JsonRpcDebug to send it
        setRequest({body});
    };

    const presetPayloads = [
        {
            name: 'Tools List',
            payload: {
                method: 'tools/list',
                params: { name: 'venture' }
            }
        },
        {
            name: 'Tools Call',
            payload: {
                method: 'tools/call',
                params: {
                    name: 'venture',
                    arguments: { query: 'Hello, how can you help me?' }
                }
            }
        },
        {
            name: 'Simple Call',
            payload: {
                method: 'call',
                params: { message: 'What services do you offer?' }
            }
        }
    ];

    const loadPresetPayload = (payload: any) => {
        setCustomPayload(JSON.stringify(payload, null, 2));
    };

    return (
        <Page
            title="MCP Debug"
            subtitle="Test JSON RPC requests to your agents"
            maxWidth="6xl"
        >
            <div className="space-y-6">
                <Card>
                    <CardBody>
                        {/* MCP URL Input */}
                        <EditableUrl
                            label="MCP Endpoint URL"
                            value={rpcUrl}
                            placeholder="https://api.matchwise.ai/mcp/location"
                            options={URL_OPTIONS}
                            onUpdate={updateWindowRpcUrl}
                        />

                        <h3>Payload</h3>
                        
                        {/* Preset Payloads */}
                        <div className="mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {presetPayloads.map((preset, index) => (
                                    <Button
                                        key={index}
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => loadPresetPayload(preset.payload)}
                                    >
                                        {preset.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Payload Editor */}
                        <div className="mb-4">
                            <textarea
                                value={customPayload}
                                onChange={handlePayloadChange}
                                className={`w-full h-48 p-3 font-mono text-sm rounded-md border resize-none ${
                                    isValidJson()
                                        ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                                        : 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                                }`}
                                placeholder="Enter your JSON RPC payload here..."
                            />
                            {!isValidJson() && (
                                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    Invalid JSON format
                                </div>
                            )}
                        </div>


                        
                        <Button
                            onClick={handleSendRequest}
                            disabled={!isValidUrl() || !isValidJson()}
                            color="primary"
                            size="md"
                        >
                            Send Request
                        </Button>
                    </CardBody>
                </Card>

                {/* JSON RPC Debug Component */}
                {rpcUrl && isValidUrl() && (
                    <JsonRpcDebug
                        url={rpcUrl}
                        request={request}
                        onFinalResult={handleResult}
                    />
                )}

                {(!rpcUrl || !isValidUrl()) && (
                    <Card>
                        <CardBody>
                            <div className="text-center py-8">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Enter a valid MCP URL above to start testing JSON RPC requests
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>
        </Page>
    );
};

export default McpDebugPage;
