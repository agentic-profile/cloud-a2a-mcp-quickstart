import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EditableUrl, LabelValue, HttpProgressSummary } from '@/components';
import { CardTitleAndBody } from '@/components/Card';
import { useSettingsStore, useUserProfileStore, useVentureStore } from '@/stores';
import { buildEndpoint } from '@/tools/misc';
import agentsData from '../agents.json';
import { MarkdownGenerator } from './MarkdownGenerator';
import { type HttpProgress, type HttpRequest } from '@/components/JsonRpcDebug';
import greenCheckmark from '@/assets/green_checkmark.svg';
import { simplifyVentureData } from '@/stores/ventureStore';

const DEFAULT_MCP_URLS = [
    'https://example-api.agenticprofile.ai/mcp/venture',
    'http://localhost:3000/mcp/venture'
];

const PublishVentureToMcp = ({ onSubmitHttpRequest }: { onSubmitHttpRequest: (httpRequest: HttpRequest) => void }) => {
    const { getVentureData } = useVentureStore();
    const { serverUrl } = useSettingsStore();
    const { userAgentDid, verificationId } = useUserProfileStore();
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);
    const navigate = useNavigate();
    
    // Find the venture agent from the agents data
    const ventureAgent = agentsData.find(agent => agent.id === 'venture')!
    
    const [mcpUrl, setMcpUrl] = useState<string>('');

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
        const simplifiedVenture = simplifyVentureData(getVentureData());
        const markdown = MarkdownGenerator.generateMarkdownSummary(simplifiedVenture);

        // Create the JSON-RPC request
        const mcpRequest = {
            method: 'tools/call',
            params: {
                name: 'update',
                profile: {
                    ...simplifiedVenture,
                    markdown,
                    kind: 'venture'
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

        // Set up the request for JsonRpcDebug
        onSubmitHttpRequest({ url: mcpUrl, requestInit: request, onProgress: setHttpProgress });
    };

    // Handle updating the mcpUrl
    const handleMcpUrlUpdate = (newUrl: string) => {
        setMcpUrl(newUrl);
    };

    // Handle navigation to identity page
    const handleManageIdentity = () => {
        navigate('/identity');
    };

    const hasIdentity = !!userAgentDid && !!verificationId;
    const spinner = httpProgress && !httpProgress.result;
    const isPublished = httpProgress && httpProgress.result?.fetchResponse?.status === 200;

    return (
        <>
            <CardTitleAndBody title="Publish Venture to MCP">
                <div className="space-y-4">
                    <EditableUrl
                        card={false}
                        label="MCP URL"
                        value={mcpUrl}
                        placeholder="Enter MCP server URL..."
                        onUpdate={handleMcpUrlUpdate}
                        options={DEFAULT_MCP_URLS}
                    />
                    { hasIdentity && <LabelValue
                        label="Publish as" 
                        value={`${userAgentDid} (key ${verificationId})`} /> }
                    <div className="flex justify-end items-center space-x-3">
                        <Button
                            onClick={handleManageIdentity}
                            variant={hasIdentity ? 'secondary' : 'primary'}
                        >
                            { hasIdentity ? 'Manage Identity' : '1. Create Identity' }
                        </Button>
                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={handlePublishToMcp}
                                variant={isPublished ? 'secondary' : hasIdentity ? 'success' : 'secondary'}
                                loading={spinner}
                                disabled={spinner ||!userAgentDid || !verificationId}
                            >
                                { hasIdentity ? 'Publish to MCP' : '2.Publish to MCP' }
                            </Button>
                            {isPublished && (
                                <img 
                                    src={greenCheckmark} 
                                    alt="Success" 
                                    className="h-8 w-8" 
                                />
                            )}
                        </div>
                    </div>

                    <HttpProgressSummary progress={httpProgress} />
                </div>
            </CardTitleAndBody>
        </>
    );
};

export default PublishVentureToMcp;
