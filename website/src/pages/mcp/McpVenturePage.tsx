import { useState } from 'react';
import { Page, Card, CardBody, Button, JsonRpcDebug, JsonEditor } from '@/components';
import { MagnifyingGlassIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { useSettingsStore } from '@/stores';
import { buildEndpoint } from '@/tools/misc';
import { mcpToolsCallRequestInit, mcpMethodRequestInit } from './util/misc';
import { mcpServices } from './mcp-list';
import McpServiceDescription from './util/McpServiceDescription';
import type { JsonExample } from '@/components/JsonEditor';

const ventureService = mcpServices.find(service => service.id === '2')!;

export interface VentureProfile {
    uuid: string;
    did: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

const EXAMPLE_PROFILES: JsonExample[] = [
    {
        name: 'Full Profile',
        payload: {
            "profile": {    // Map
                "name": "TechStart Inc.",
                "description": "A revolutionary AI-powered startup focused on sustainable technology solutions.",
                "company": {
                    "name": "TechStart Inc.",
                    "founded": "2024",
                    "employees": 50,
                    "location": {
                        "city": "San Francisco",
                        "state": "CA",
                        "country": "USA"
                    }
                },
                "funding": {
                    "stage": "Series A",
                    "amount": 5000000,
                    "investors": ["VC1", "VC2", "VC3"]
                },
                "technologies": ["AI", "Machine Learning", "Cloud"],
                "social": {
                    "website": "https://techstart.com",
                    "linkedin": "https://linkedin.com/company/techstart",
                    "twitter": "@techstart"
                }
            }
        }
    },
    {
        name: 'Simple Profile',
        payload: {
            "profile": {
                "name": "Simple Co.",
                "description": "A revolutionary AI-powered startup focused on sustainable technology solutions.",
            }
        }
    }
]

interface Result {
    fetchResponse: Response | undefined;
    text: string | undefined;
    data: any | undefined;
    error: unknown;
}

const McpVenturePage = () => {
    const { serverUrl } = useSettingsStore();
    const [profileJson, setProfileJson] = useState('');

    const [mcpRequest, setMcpRequest] = useState<RequestInit | null>(null);

    // Construct the MCP endpoint URL
    const mcpEndpoint = buildEndpoint(serverUrl, 'mcp/venture');

    const handleUpdate = () => {
        const profile = JSON.parse(profileJson);
        setMcpRequest( mcpToolsCallRequestInit( "update", profile ));
    };

    const handleRecentUpdates = () => {
        setMcpRequest( mcpToolsCallRequestInit( "recent-updates", { since: new Date().toISOString() }));
    };

    const clearResults = () => {
        setMcpRequest(null);
    };

    const handleMcpResult = (result: Result) => {
        // Handle the result from JsonRpcDebug if needed
        console.log('Update result:', result);
    };

    return (
        <Page
            title="Venture MCP Service"
            subtitle="Manage your venture profile and list of others"
        >
            {/* Service Information */}
            <McpServiceDescription
                service={ventureService}
                endpoint={mcpEndpoint}
                tools={[
                    {
                        name: 'update',
                        description: 'Update venture profile information'
                    },
                    {
                        name: 'query',
                        description: 'Get venture profile information'
                    }
                ]}
                dataFormat="Venture profiles are stored with uuid, did, name, description, and timestamps for creation and updates."
            />

            {/* Profile Update Form */}
            <Card>
                <CardBody>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                            <ArrowUpIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">Update Venture Profile</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <JsonEditor 
                            value={profileJson}
                            onChange={setProfileJson}
                            placeholder="Enter your JSON RPC payload here..."
                            height="h-48"
                            examples={EXAMPLE_PROFILES}
                        />
                        
                        <Button
                            onClick={handleUpdate}
                            className="w-full"
                            color="primary"
                        >
                            Update Venture Profile
                        </Button>
                    </div>
                </CardBody>
            </Card>

            {/* Profile Query Form */}
            {false && <Card>
                <CardBody>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                            <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">Query Venture Profiles</h3>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Click the button below to query the current ventures.
                    </p>
                    
                    <Button
                        onClick={handleRecentUpdates}
                        className="w-full"
                        color="success"
                    >
                        Query Ventures
                    </Button>
                </CardBody>
            </Card> }

            {/* Action Buttons Row */}
            <div className="mt-6">
                <div className="flex flex-wrap gap-3 mb-4">
                    <Button
                        onClick={() => setMcpRequest(mcpToolsCallRequestInit("read"))}
                    >
                        Read Profile
                    </Button>
                    <Button
                        onClick={() => setMcpRequest(mcpToolsCallRequestInit("recent-updates"))}
                    >
                        Recent Profiles
                    </Button>
                    <Button
                        onClick={() => setMcpRequest(mcpToolsCallRequestInit("delete"))}
                    >
                        Delete Profile
                    </Button>
                    <Button
                        onClick={() => setMcpRequest(mcpMethodRequestInit("tools/list"))}
                    >
                        List Tools
                    </Button>
                </div>
            </div>

            {/* JsonRpcDebug Component for Update Location */}
            {mcpRequest && (
                <div className="mt-6">
                    <JsonRpcDebug
                        url={mcpEndpoint}
                        httpRequest={{
                            requestInit: mcpRequest,
                            onProgress: (progress) => progress.result && handleMcpResult(progress.result)
                        }}
                        onClose={clearResults}
                    />
                </div>
            )}
        </Page>
    );
};

export default McpVenturePage;