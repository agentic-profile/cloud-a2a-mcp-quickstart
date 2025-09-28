import { useState } from 'react';
import { Page, JsonRpcDebug } from '@/components';
import { useSettingsStore } from '@/stores';
import { buildEndpoint } from '@/tools/net';
import { mcpServices } from '../mcp-list';
import McpServiceDescription from '../util/McpServiceDescription';
import UpdateVentureProfile from './UpdateVentureProfile';
import QueryVentureProfiles from './QueryVentureProfiles';
import QuickActions from './QuickActions';
import type { HttpRequest } from '@/components/JsonRpcDebug';

const ventureService = mcpServices.find(service => service.id === '2')!;

export interface VentureProfile {
    uuid: string;
    did: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

const McpVenturePage = () => {
    const { serverUrl } = useSettingsStore();
    const [httpRequest, setHttpRequest] = useState<HttpRequest | null>(null);

    // Construct the MCP endpoint URL
    const mcpEndpoint = buildEndpoint(serverUrl, 'mcp/venture');

    const clearResults = () => {
        setHttpRequest(null);
    };

    return (
        <Page
            title="Venture MCP Service"
            subtitle="Manage your venture profile and list of others"
        >
            <div className="space-y-6">
                {/* Service Information */}
                <McpServiceDescription
                    service={ventureService}
                    endpoint={mcpEndpoint}
                />

                {/* Profile Update Form */}
                <UpdateVentureProfile onSubmitHttpRequest={setHttpRequest} />

                {/* Profile Query Form */}
                <QueryVentureProfiles onSubmitHttpRequest={setHttpRequest} />

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

export default McpVenturePage;