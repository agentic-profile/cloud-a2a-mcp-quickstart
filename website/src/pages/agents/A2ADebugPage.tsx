import { useState, useRef } from 'react';
import { Page, JsonRpcDebug, Card, CardBody, Button } from '@/components';

export interface A2ARequest {
    jsonrpc: '2.0';
    id: string;
    method: string;
    params?: any;
}

const A2ADebugPage = () => {
    const [a2aUrl, setA2aUrl] = useState<string>('http://localhost:3000/a2a/venture');
    const [customPayload, setCustomPayload] = useState<string>('');
    const [request, setRequest] = useState<RequestInit | null>(null);
    const sendButtonRef = useRef<HTMLButtonElement>(null);

    const handlePayloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCustomPayload(e.target.value);
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setA2aUrl(e.target.value);
    };

    const handleResult = (result: any) => {
        console.log('A2A Result:', result);
    };

    const getParsedPayload = () => {
        try {
            return JSON.parse(customPayload);
        } catch (error) {
            return { error: 'Invalid JSON' };
        }
    };

    const isValidJson = () => {
        if (customPayload.trim() === '') {
            return true;
        }

        try {
            JSON.parse(customPayload);
            return true;
        } catch {
            return false;
        }
    };

    const isValidUrl = () => {
        try {
            new URL(a2aUrl);
            return true;
        } catch {
            return false;
        }
    };

    const handleSendRequest = () => {
        if (!a2aUrl.trim()) {
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
            method: getParsedPayload().method || 'task/send',
            params: getParsedPayload().params || getParsedPayload()
        });

        // Set the request - this will automatically trigger JsonRpcDebug to send it
        setRequest({body});

        // Remove focus from the button after sending
        if (sendButtonRef.current) {
            sendButtonRef.current.blur();
        }
    };

    const presetPayloads = [
        {
            name: 'Task Send Message',
            payload: {
                method: 'task/send',
                params: {
                    message: {
                        role: 'user',
                        parts: [
                            {
                                kind: 'text',
                                text: 'Hello Venture agent, what can you help me with?'
                            }
                        ],
                        messageId: '123'
                    },
                    metadata: {}
                }
            }
        },
    ];

    const loadPresetPayload = (payload: any) => {
        setCustomPayload(JSON.stringify(payload, null, 2));
    };

    return (
        <Page
            title="A2A Debug"
            subtitle="Test A2A (Agent-to-Agent) API requests to your agents"
            maxWidth="6xl"
        >
            <div className="space-y-6">
                <Card>
                    <CardBody>
                        {/* A2A URL Input */}
                        <h3>
                            A2A Endpoint URL
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <input
                                    type="url"
                                    value={a2aUrl}
                                    onChange={handleUrlChange}
                                    placeholder="http://localhost:3000/a2a/venture"
                                    className={`w-full p-3 border rounded-md text-sm ${
                                        a2aUrl && !isValidUrl()
                                            ? 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                                    }`}
                                />
                                {a2aUrl && !isValidUrl() && (
                                    <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                                        Please enter a valid URL
                                    </div>
                                )}
                            </div>
                        </div>

                        <h3>
                            Request Payload
                        </h3>
                        
                        {/* Preset Payloads */}
                        <div className="mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {presetPayloads.map((preset, index) => (
                                    <Button
                                        key={index}
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => loadPresetPayload(preset.payload)}
                                        className="text-left h-auto p-3"
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
                                placeholder="Enter your A2A JSON RPC payload here..."
                            />
                            {!isValidJson() && (
                                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    Invalid JSON format
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                ref={sendButtonRef}
                                onClick={handleSendRequest}
                                disabled={!a2aUrl.trim() || !isValidUrl() || !isValidJson()}
                                color="primary"
                                size="md"
                            >
                                Send A2A Request
                            </Button>
                            <Button
                                onClick={() => setCustomPayload('')}
                                variant="secondary"
                                size="md"
                            >
                                Clear
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* JSON RPC Debug Component */}
                {a2aUrl && isValidUrl() && (
                    <JsonRpcDebug
                        url={a2aUrl}
                        request={request}
                        onFinalResult={handleResult}
                    />
                )}

                {(!a2aUrl || !isValidUrl()) && (
                    <Card>
                        <CardBody>
                            <div className="text-center py-8">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Enter a valid A2A endpoint URL above to start testing agent-to-agent requests
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>
        </Page>
    );
};

export default A2ADebugPage;
