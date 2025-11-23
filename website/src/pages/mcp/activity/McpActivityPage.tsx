import { useState } from 'react';
import { Page, JsonRpcDebug } from '@/components';
import { useSettingsStore } from '@/stores';
import { buildEndpoint } from '@/tools/net';
import { mcpServices } from '../mcp-list';
import McpServiceDescription from '../util/McpServiceDescription';
import UpdateActivity from './UpdateActivity';
import QueryActivities from './QueryActivities';
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

const McpActivityPage = () => {
    const { serverUrl } = useSettingsStore();
    const [httpRequest, setHttpRequest] = useState<HttpRequest | null>(null);

    // Construct the MCP endpoint URL
    const mcpEndpoint = buildEndpoint(serverUrl, 'mcp/activity');

    const clearResults = () => {
        setHttpRequest(null);
    };

    return (
        <Page
            title="Activity MCP Service"
            subtitle="Find activities that people can do"
        >
            <div className="space-y-6">
                {/* Service Information */}
                <McpServiceDescription
                    service={communityService}
                    endpoint={mcpEndpoint}
                />

                {/* Update Form */}
                <UpdateActivity onSubmitHttpRequest={setHttpRequest} />

                {/* Query Form */}
                <QueryActivities onSubmitHttpRequest={setHttpRequest} />

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

export default McpActivityPage;