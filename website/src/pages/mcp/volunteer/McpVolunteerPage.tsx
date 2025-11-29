import { useState } from 'react';
import { Page, JsonRpcDebug } from '@/components';
import { useSettingsStore } from '@/stores';
import { buildEndpoint } from '@/tools/net';
import { mcpServices } from '../mcp-list';
import McpServiceDescription from '../util/McpServiceDescription';
import UpdateVolunteer from './UpdateVolunteer';
import QueryVolunteers from './QueryVolunteers';
import QuickActions from './QuickActions';
import type { HttpRequest } from '@/components/JsonRpcDebug';

const volunteerService = mcpServices.find(service => service.id === '7')!;

const McpVolunteerPage = () => {
    const { serverUrl } = useSettingsStore();
    const [httpRequest, setHttpRequest] = useState<HttpRequest | null>(null);

    // Construct the MCP endpoint URL
    const mcpEndpoint = buildEndpoint(serverUrl, 'mcp/volunteer');

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
                    service={volunteerService}
                    endpoint={mcpEndpoint}
                />

                {/* Update Form */}
                <UpdateVolunteer onSubmitHttpRequest={setHttpRequest} />

                {/* Query Form */}
                <QueryVolunteers onSubmitHttpRequest={setHttpRequest} />

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

export default McpVolunteerPage;
