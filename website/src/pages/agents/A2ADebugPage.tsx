import { useState, useRef } from 'react';
import { Page, JsonRpcDebug, Card, CardBody, Button, EditableUrl } from '@/components';
import { useRpcUrlFromWindow, updateWindowRpcUrl, DEFAULT_SERVER_URLS } from '@/tools/misc';

const URL_OPTIONS = DEFAULT_SERVER_URLS.map(url => url+'/a2a/venture');

export interface A2ARequest {
    jsonrpc: '2.0';
    id: string;
    method: string;
    params?: any;
}

const A2ADebugPage = () => {
    const [customPayload, setCustomPayload] = useState<string>('');
    const [request, setRequest] = useState<RequestInit | null>(null);
    const rpcUrl = useRpcUrlFromWindow();
    const sendButtonRef = useRef<HTMLButtonElement>(null);
    const jsonRpcDebugRef = useRef<HTMLDivElement>(null);

    const handlePayloadChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCustomPayload(e.target.value);
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
            method: getParsedPayload().method || 'task/send',
            params: getParsedPayload().params || getParsedPayload()
        });

        // Set the request - this will automatically trigger JsonRpcDebug to send it
        setRequest({body});

        // Remove focus from the button after sending
        if (sendButtonRef.current) {
            sendButtonRef.current.blur();
        }

        // Scroll to the JSON RPC Debug card after a short delay to ensure it's rendered
        setTimeout(() => {
            if (jsonRpcDebugRef.current) {
                jsonRpcDebugRef.current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        }, 100);
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
                        <EditableUrl
                            label="A2A Endpoint URL"
                            value={rpcUrl}
                            placeholder="https://api.matchwise.ai/agents/connect"
                            options={URL_OPTIONS}
                            onUpdate={updateWindowRpcUrl}
                        />

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
                                disabled={!isValidUrl() || !isValidJson()}
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
                {rpcUrl && isValidUrl() && (
                    <div ref={jsonRpcDebugRef}>
                        <JsonRpcDebug
                            url={rpcUrl}
                            request={request}
                            onClear={() => setRequest(null)}
                            onFinalResult={handleResult}
                        />
                    </div>
                )}
            </div>
        </Page>
    );
};

export default A2ADebugPage;
