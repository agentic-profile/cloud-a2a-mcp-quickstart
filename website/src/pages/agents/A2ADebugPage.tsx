import { useState, useRef } from 'react';
import { Page, JsonRpcDebug, Card, CardBody, Button, EditableUri, JsonEditor } from '@/components';
import { useParamFromWindow, updateWindowParam, DEFAULT_SERVER_URLS, buildEndpoint } from '@/tools/net';
import { useSettingsStore } from '@/stores/settingsStore';
import { v4 as uuidv4 } from "uuid";

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
    const queryRpcUrl = useParamFromWindow('rpcUrl');
    const { serverUrl } = useSettingsStore();
    const sendButtonRef = useRef<HTMLButtonElement>(null);
    const jsonRpcDebugRef = useRef<HTMLDivElement>(null);

    // Use queryRpcUrl if available, otherwise fallback to serverUrl + "/mcp/location"
    const rpcUrl = queryRpcUrl || (serverUrl ? buildEndpoint(serverUrl, '/a2a/venture') : null);

    const handlePayloadChange = (value: string) => {
        setCustomPayload(value);
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
            method: getParsedPayload().method || 'message/send',
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
            name: 'Send Message',
            payload: {
                method: 'message/send',
                params: {
                    id: uuidv4(),
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
                        <EditableUri
                            label="A2A Endpoint URL"
                            value={rpcUrl}
                            placeholder="https://api.matchwise.ai/agents/connect"
                            options={URL_OPTIONS}
                            onUpdate={(url) => updateWindowParam('rpcUrl', url)}
                        />

                        <h3>
                            Request Payload
                        </h3>
                        
                        {/* Custom Payload Editor */}
                        <JsonEditor
                            value={customPayload}
                            onChange={handlePayloadChange}
                            placeholder="Enter your A2A JSON RPC payload here..."
                            height="h-48"
                            examples={presetPayloads}
                        />

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
                            httpRequest={request ? {
                                requestInit: request,
                                onProgress: (progress) => progress.result && handleResult(progress.result)
                            } : null}
                            onClear={() => setRequest(null)}
                        />
                    </div>
                )}
            </div>
        </Page>
    );
};

export default A2ADebugPage;
