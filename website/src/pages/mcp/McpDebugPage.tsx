import { useState } from 'react';
import { Page, JsonRpcDebug, Card, CardBody, Button, EditableUrl, JsonEditor, HttpProgressSummary } from '@/components';
import { useRpcUrlFromWindow, updateWindowRpcUrl, DEFAULT_SERVER_URLS, buildEndpoint } from '@/tools/misc';
import { useSettingsStore } from '@/stores/settingsStore';
import { type HttpProgress, type HttpRequest } from '@/components/JsonRpcDebug';

const URL_OPTIONS = DEFAULT_SERVER_URLS.map(url => url+'/mcp/location');

const EXAMPLE_PAYLOADS = [
    {
        name: 'Tools List',
        payload: {
            method: 'tools/list',
            params: {}
        }
    },
    {
        name: 'Update Location',
        payload: {
            "method": "tools/call",
            "params": {
                "name": "update",
                "coords": {
                    "latitude": 40.7128,
                    "longitude": -74.006
                }
            }
        }
    },
    {
        name: 'Query Location',
        payload: {
            method: 'tools/call',
            params: {
                name: 'query'
            }
        }
    }
];

export interface McpRequest {
    jsonrpc: '2.0';
    id: string;
    method: string;
    params?: any;
}

const McpDebugPage = () => {
    const [customPayload, setCustomPayload] = useState<string>('{\n  "method": "tools/list",\n  "params": {\n    "name": "test"\n  }\n}');
    const [httpRequest, setHttpRequest] = useState<HttpRequest | null>(null);
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);
    const queryRpcUrl = useRpcUrlFromWindow();
    const { serverUrl } = useSettingsStore();

    // Use queryRpcUrl if available, otherwise fallback to serverUrl + "/mcp/location"
    const rpcUrl = queryRpcUrl || (serverUrl ? buildEndpoint(serverUrl, '/mcp/location') : null);

    const handlePayloadChange = (value: string) => {
        setCustomPayload(value);
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
        setHttpRequest({requestInit: {body}, onProgress: setHttpProgress});
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
                        
                        {/* Custom Payload Editor */}
                        <JsonEditor
                            value={customPayload}
                            onChange={handlePayloadChange}
                            placeholder="Enter your JSON RPC payload here..."
                            height="h-48"
                            examples={EXAMPLE_PAYLOADS}
                        />

                        <Button
                            onClick={handleSendRequest}
                            disabled={!isValidUrl() || !isValidJson()}
                            color="primary"
                            size="md"
                        >
                            Send Request
                        </Button>

                        <HttpProgressSummary progress={httpProgress} />
                    </CardBody>
                </Card>

                {/* JSON RPC Debug Component */}
                {rpcUrl && isValidUrl() && (
                    <JsonRpcDebug
                        url={rpcUrl}
                        httpRequest={httpRequest}
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
