import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EditableUri, LabelValue, HttpProgressSummary, Checkbox } from '@/components';
import { CardTitleAndBody } from '@/components/Card';
import { useImportIdentityStore, useSettingsStore, useUserProfileStore } from '@/stores';
import { type HttpProgress, type HttpRequest } from '@/components/JsonRpcDebug';
import { createEdDsaJwk } from "@agentic-profile/auth";
import greenCheckmark from '@/assets/green_checkmark.svg';
import type { AgenticProfile, AgentService } from '@agentic-profile/common/schema';

const DEFAULT_MCP_URLS = [
    'https://api.matchwise.ai/mcp/agents',
    'http://localhost:3003/mcp/agents'
];

function resolveMcpAgentManagerUrlFromDid(did: string) {
    const [ method, web, host ] = did.toLowerCase().split(':');
    if (method !== 'did' || web !== 'web')
        return '';
    let [ hostname, portnumber ] = decodeURIComponent(host).split(':');
    if(hostname === 'iamagentic.ai')
        hostname = 'api.matchwise.ai';
    const port = portnumber ? `:${portnumber}` : '';
    const schema = hostname === 'localhost' ? 'http' : 'https';

    return `${schema}://${hostname}${port}/mcp/agents`;
}

const EnlistAgent = ({ onSubmitHttpRequest }: { onSubmitHttpRequest: (httpRequest: HttpRequest) => void }) => {
    const { serverUrl } = useSettingsStore();
    const { userProfile, setUserProfile, userAgentDid, verificationId } = useUserProfileStore();
    const { setOnSuccessAction } = useImportIdentityStore();
    const [ httpProgress, setHttpProgress ] = useState<HttpProgress | undefined>(undefined);
    const navigate = useNavigate();
    
    // Find the venture agent from the agents data
    const [mcpAgentManagerUrl, setMcpAgentManagerUrl] = useState<string>('');
    const [serviceEndpoint, setServiceEndpoint] = useState<string>('');
    const [createLocalAgentKey, setCreateLocalAgentKey] = useState<boolean>(false);

    // Set mcpUrl based on userAgentDid
    useEffect(() => {
        setMcpAgentManagerUrl(userAgentDid ? resolveMcpAgentManagerUrlFromDid(userAgentDid) : '');
    }, [userAgentDid]);

    useEffect(() => {
        setServiceEndpoint(`${serverUrl}/a2a/venture`);
    }, [serverUrl]);

    // Handle hiring agent
    const handleHireAgent = async () => {
        if (!serverUrl) {
            alert('MCP URL not configured. Please configure the MCP URL above.');
            return;
        }

        const agentKeyring = await createEdDsaJwk();
        const userJwk = {
            id: `#user-key-venture-${Math.floor(Date.now() / 1000)}`,
            type: "JsonWebKey2020",
            publicKeyJwk: agentKeyring.publicJwk
        }

        let { hostname, port} = new URL(serverUrl);

        port = port && port != '443' ? `%3A${port}` : '';
        const service = {
            name: "Venture Agent",
            id: "#venture",
            type: "A2A/venture",
            serviceEndpoint,
            capabilityInvocation: [
                `did:web:${hostname}${port}#system-key`,
            ]
        } as AgentService;

        if( createLocalAgentKey ) {
            service.capabilityInvocation.push( userJwk as any );
        }

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

        onSubmitHttpRequest({ url: mcpAgentManagerUrl, requestInit: request, onProgress: (progress) => {
            setHttpProgress(progress);
            if( progress.result?.fetchResponse?.status === 200 ) {
                if( createLocalAgentKey ) {
                    let { profile = {} as AgenticProfile, keyring = [] } = userProfile ?? {};

                    // append new keys to keyring
                    keyring = [...keyring, agentKeyring];

                    // append new service to profile (and remove old one if it exists)
                    const updatedServices = (profile.service ?? []).filter((s) => s.id !== service.id);
                    updatedServices.push(service);

                    profile = { ...profile, service: updatedServices };
                    setUserProfile({profile, keyring});
                }
            }
        }});
    };

    // Handle navigation to identity page
    const handleManageIdentity = () => {
        setOnSuccessAction({ page: '/agents/venture#enlist-agent' });
        navigate('/identity');
    };

    const hasIdentity = !!userAgentDid && !!verificationId;
    const spinner = httpProgress && !httpProgress.result;
    const isPublished = httpProgress && httpProgress.result?.fetchResponse?.status === 200;

    return (
        <>
            <CardTitleAndBody title="Enlist an AI Agent">
                <p className="mb-4">
                    This adds an AI agent to your personal <a href="https://agenticprofile.ai" target="_blank">Agentic Profile</a>.
                    This agent can answer questions on your behalf about the venture you described above.
                </p>
                <div className="space-y-4">
                    { hasIdentity && <LabelValue
                        label="Add to your identity at" 
                        value={`${userAgentDid} (key ${verificationId})`} /> }
                    <EditableUri
                        card={false}
                        label="Identity Host Agent Manager URL"
                        value={mcpAgentManagerUrl}
                        placeholder="Enter A2A server URL..."
                        onUpdate={setMcpAgentManagerUrl}
                        options={DEFAULT_MCP_URLS}
                    />
                    <p className="sm !mb-8">
                        This is the URL of the MCP service at your Identity Host that manages adding new agents. 
                        We will use this MCP service to add the Venture Agent to your Agentic Profile.
                    </p>
                    <EditableUri
                        card={false}
                        label="Venture Agent A2A Service Endpoint"
                        value={serviceEndpoint}
                        placeholder="Enter A2A server URL..."
                        onUpdate={setServiceEndpoint}
                        options={DEFAULT_MCP_URLS}
                    />
                    <p className="sm">
                        This is the URL of the A2A Venture Agent that will be added to your Agentic Profile.
                    </p>
                    <Checkbox
                        checked={createLocalAgentKey}
                        onChange={setCreateLocalAgentKey}
                        label="Create local agent key for testing"
                    />
                    <div className="flex justify-end space-x-3">
                        <Button
                            onClick={handleManageIdentity}
                            variant={hasIdentity ? 'secondary' : 'success'}
                        >
                            { hasIdentity ? 'Setup Your Identity' : '1. Setup Your Identity' }
                        </Button>
                        <Button
                            onClick={handleHireAgent}
                            variant={isPublished ? 'secondary' : hasIdentity ? 'success' : 'secondary'}
                            loading={spinner}
                            disabled={spinner ||!userAgentDid || !verificationId}
                        >
                            { hasIdentity ? 'Enlist Agent' : '2. Enlist Agent' }
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
