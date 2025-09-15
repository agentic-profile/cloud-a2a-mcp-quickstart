import { useState, useRef, useEffect } from 'react';
import { JsonRpcDebug, Button, EditableUrl } from '@/components';
import { CardTitleAndBody } from '@/components/Card';
import { useSettingsStore, useVentureStore } from '@/stores';
import { buildEndpoint } from '@/tools/misc';
import agentsData from '../agents.json';
import { MarkdownGenerator } from './MarkdownGenerator';

const PublishVentureToMcp = () => {
    const { prunedVentureData } = useVentureStore();
    const { serverUrl } = useSettingsStore();
    
    // Find the venture agent from the agents data
    const ventureAgent = agentsData.find(agent => agent.id === 'venture')!;
    
    const [showMcpDebug, setShowMcpDebug] = useState(false);
    const [mcpRequest, setMcpRequest] = useState<RequestInit | null>(null);
    const [mcpUrl, setMcpUrl] = useState<string>('');
    const mcpDebugRef = useRef<HTMLDivElement>(null);

    // Set mcpUrl based on serverUrl and ventureAgent
    useEffect(() => {
        if (serverUrl && ventureAgent?.mcpUrl) {
            const url = buildEndpoint(serverUrl, ventureAgent.mcpUrl);
            setMcpUrl(url || '');
        } else {
            setMcpUrl('');
        }
    }, [serverUrl, ventureAgent]);

    // Handle publishing to MCP
    const handlePublishToMcp = () => {
        if (!mcpUrl) {
            alert('MCP URL not configured. Please configure the MCP URL above.');
            return;
        }

        // Create the venture data payload
        const ventureData = prunedVentureData();
        const markdown = MarkdownGenerator.generateMarkdownSummary(ventureData);

        // Create the JSON-RPC request
        const jsonRpcRequest = {
            method: 'tools/call',
            params: {
                name: 'update',
                profile: ventureData,
                markdown
            }
        };

        // Set up the request for JsonRpcDebug
        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonRpcRequest)
        };

        setMcpRequest(request);
        setShowMcpDebug(true);

        // Scroll to the MCP debug card
        setTimeout(() => {
            mcpDebugRef.current?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    // Handle the result from JsonRpcDebug
    const handleMcpResult = (result: any) => {
        console.log('MCP Result:', result);
        // You can add additional handling here if needed
    };

    // Handle updating the mcpUrl
    const handleMcpUrlUpdate = (newUrl: string) => {
        setMcpUrl(newUrl);
    };

    return (
        <>
            <CardTitleAndBody title="Publish Venture">
                <div className="space-y-4">
                    <EditableUrl
                        label="MCP URL"
                        value={mcpUrl}
                        placeholder="Enter MCP server URL..."
                        onUpdate={handleMcpUrlUpdate}
                    />
                    <div className="flex justify-start">
                        <Button
                            onClick={handlePublishToMcp}
                            variant="primary"
                        >
                            Publish to MCP
                        </Button>
                    </div>
                </div>
            </CardTitleAndBody>

            {/* MCP Debug Card */}
            {showMcpDebug && (
                <div ref={mcpDebugRef}>
                    <JsonRpcDebug
                        url={mcpUrl || undefined}
                        request={mcpRequest}
                        onFinalResult={handleMcpResult}
                        onClose={() => setShowMcpDebug(false)}
                        onClear={() => setMcpRequest(null)}
                    />
                </div>
            )}
        </>
    );
};

export default PublishVentureToMcp;
