import { useState } from 'react';
import { Page, Card, CardBody, LabelValue, JsonRpcDebug } from '@/components';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useSettingsStore } from '@/stores';
import { buildEndpoint } from '@/tools/misc';
import { type HttpRequest } from '@/components/JsonRpcDebug';
import QueryLocation from './QueryLocation';
import UpdateLocation from './UpdateLocation';

const McpLocationPage = () => {
    const { serverUrl } = useSettingsStore();
    const [httpRequest, setHttpRequest] = useState<HttpRequest | null>(null);

    // Construct the MCP endpoint URL
    const mcpEndpoint = buildEndpoint(serverUrl, 'mcp/location');

    const clearResults = () => {
        setHttpRequest(null);
    };

    // Handle case where endpoint cannot be built
    if (!mcpEndpoint) {
        return (
            <Page
                title="Location MCP Service"
                subtitle="Test location management and geolocation services"
            >
                <Card className="mb-6">
                    <CardBody>
                        <p className="text-red-600 dark:text-red-400">
                            Unable to construct MCP endpoint. Please check your server URL configuration.
                        </p>
                    </CardBody>
                </Card>
            </Page>
        );
    }

    return (
        <Page
            title="Location MCP Service"
            subtitle="Test location management and geolocation services"
        >
            {/* Service Information */}
            <Card className="mb-6">
                <CardBody>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                            <MapPinIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">Location MCP Service</h3>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                        <LabelValue label="Endpoint" value={mcpEndpoint} />
                        <p>
                            <strong>Available Tools:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li><strong>update:</strong> Update location coordinates for a user</li>
                            <li><strong>query:</strong> Get location coordinates for a user</li>
                        </ul>
                        <p>
                            <strong>Data Format:</strong> Coordinates are stored with latitude and longitude values, along with a timestamp of when they were last updated.
                        </p>
                    </div>
                </CardBody>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Location Update Form */}
                <UpdateLocation onSubmitHttpRequest={setHttpRequest} />

                {/* Location Query Form */}
                <QueryLocation onSubmitHttpRequest={setHttpRequest} />
            </div>

            {/* JsonRpcDebug Component */}
            {httpRequest && (
                <div className="mt-6">
                    <JsonRpcDebug
                        url={mcpEndpoint}
                        httpRequest={httpRequest}
                        onClose={clearResults}
                    />
                </div>
            )}
        </Page>
    );
};

export default McpLocationPage;
