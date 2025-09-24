import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EditableUrl, LabelValue, HttpProgressSummary } from '@/components';
import { CardTitleAndBody } from '@/components/Card';
import { useSettingsStore, useUserProfileStore } from '@/stores';
import { buildEndpoint } from '@/tools/misc';
import agentsData from '../agents.json';
import { type HttpProgress, type HttpRequest } from '@/components/JsonRpcDebug';
import greenCheckmark from '@/assets/green_checkmark.svg';

const DEFAULT_MCP_URLS = [
    'https://api.matchwise.ai/mcp/agents',
    'http://localhost:3003/agents'
];

const EnlistAgent = ({ onSubmitHttpRequest }: { onSubmitHttpRequest: (httpRequest: HttpRequest) => void }) => {
    const { serverUrl } = useSettingsStore();
    const { userAgentDid, verificationId } = useUserProfileStore();
    const [ httpProgress, setHttpProgress ] = useState<HttpProgress | undefined>(undefined);
    const navigate = useNavigate();
    
    // Find the venture agent from the agents data
    const ventureAgent = agentsData.find(agent => agent.id === 'venture')!
    const [a2aUrl, setA2aUrl] = useState<string>('');

    // Set mcpUrl based on serverUrl and ventureAgent
    useEffect(() => {
        if (serverUrl && ventureAgent?.agentUrl) {
            const url = buildEndpoint(serverUrl, ventureAgent.agentUrl);
            setA2aUrl(url || '');
        } else {
            setA2aUrl('');
        }
    }, [serverUrl, ventureAgent]);

    // Handle hiring agent
    const handleHireAgent = () => {
        if (!serverUrl) {
            alert('MCP URL not configured. Please configure the MCP URL above.');
            return;
        }

        const { hostname, port} = new URL(serverUrl);

        const service = {
            name: "Venture Agent",
            id: "#venture",
            type: "A2A/venture",
            serviceEndpoint: `${serverUrl}/a2a/venture`,
            capabilityInvocation: [
                `did:web:${hostname}${port != '443' ? `:${port}` : ''}#system-key`
            ]
        };

        // Create the JSON-RPC request for hiring an agent
        const jsonRpcRequest = {
            method: 'tools/call',
            params: {
                name: 'add-agent',
                service
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

        onSubmitHttpRequest({ url: a2aUrl, requestInit: request, onProgress: setHttpProgress });
    };

    // Handle updating the mcpUrl
    const handleMcpUrlUpdate = (newUrl: string) => {
        setA2aUrl(newUrl);
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
            <CardTitleAndBody title="Hire an Agent">
                <div className="space-y-4">
                    <EditableUrl
                        card={false}
                        label="A2A URL"
                        value={a2aUrl}
                        placeholder="Enter A2A server URL..."
                        onUpdate={handleMcpUrlUpdate}
                        options={DEFAULT_MCP_URLS}
                    />
                    { hasIdentity && <LabelValue
                        label="Hire as" 
                        value={`${userAgentDid} (key ${verificationId})`} /> }
                    <div className="flex justify-end space-x-3">
                        <Button
                            onClick={handleManageIdentity}
                            variant={hasIdentity ? 'secondary' : 'primary'}
                        >
                            { hasIdentity ? 'Manage Identity' : '1. Create Identity' }
                        </Button>
                        <Button
                            onClick={handleHireAgent}
                            variant={isPublished ? 'secondary' : hasIdentity ? 'success' : 'secondary'}
                            loading={spinner}
                            disabled={spinner ||!userAgentDid || !verificationId}
                        >
                            { hasIdentity ? 'Hire Agent' : '2. Hire Agent' }
                        </Button>
                        {isPublished && (
                            <img 
                                src={greenCheckmark} 
                                alt="Success" 
                                className="h-8 w-8" 
                            />
                        )}
                    </div>
                    <HttpProgressSummary progress={httpProgress} />
                </div>
            </CardTitleAndBody>
        </>
    );
};

export default EnlistAgent;
