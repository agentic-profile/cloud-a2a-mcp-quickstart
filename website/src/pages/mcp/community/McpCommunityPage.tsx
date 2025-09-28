import { useState } from 'react';
import { Page, JsonRpcDebug } from '@/components';
import { useSettingsStore } from '@/stores';
import { buildEndpoint } from '@/tools/net';
import { mcpServices } from '../mcp-list';
import McpServiceDescription from '../util/McpServiceDescription';
import UpdateCommunityProfile from './UpdateCommunityProfile';
import QueryCommunityProfiles from './QueryCommunityProfiles';
import QuickActions from './QuickActions';
import type { HttpRequest } from '@/components/JsonRpcDebug';

const communityService = mcpServices.find(service => service.id === '5')!;

/*
export interface VentureProfile {
    uuid: string;
    did: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}*/

const McpCommunityPage = () => {
    const { serverUrl } = useSettingsStore();
    const [httpRequest, setHttpRequest] = useState<HttpRequest | null>(null);

    // Construct the MCP endpoint URL
    const mcpEndpoint = buildEndpoint(serverUrl, 'mcp/community');

    const clearResults = () => {
        setHttpRequest(null);
    };

    return (
        <Page
            title="Community MCP Service"
            subtitle="Manage your community members"
        >
            <div className="space-y-6">
                {/* Service Information */}
                <McpServiceDescription
                    service={communityService}
                    endpoint={mcpEndpoint}
                />

                {/* Profile Update Form */}
                <UpdateCommunityProfile onSubmitHttpRequest={setHttpRequest} />

                {/* Profile Query Form */}
                <QueryCommunityProfiles onSubmitHttpRequest={setHttpRequest} />

                {/* Quick Actions */}
                <QuickActions onSubmitHttpRequest={setHttpRequest} />

                {/* JsonRpcDebug Component for Update Location */}
                {httpRequest && (
                    <JsonRpcDebug
                        url={mcpEndpoint}
                        httpRequest={httpRequest}
                        onClose={clearResults}
                    />
                )}
            </div>
        </Page>
    );
};

export default McpCommunityPage;