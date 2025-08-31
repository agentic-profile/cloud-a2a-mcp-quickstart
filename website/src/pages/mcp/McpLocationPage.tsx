import React, { useState } from 'react';
import { Page, Card, CardBody, Button, JsonRpcDebug, LabelValue } from '@/components';
import { MapPinIcon, MagnifyingGlassIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import { useSettingsStore } from '@/stores';

interface LocationData {
    latitude: number;
    longitude: number;
}

interface Result {
    fetchResponse: Response | undefined;
    text: string | undefined;
    data: any | undefined;
    error: unknown;
}

const McpLocationPage = () => {
    const { serverUrl } = useSettingsStore();
    const [locationData, setLocationData] = useState<LocationData>({
        latitude: 40.7128,
        longitude: -74.0060
    });

    const [mcpRequest, setMcpRequest] = useState<RequestInit | null>(null);

    // Construct the MCP endpoint URL
    const mcpEndpoint = new URL('/mcp/location', serverUrl).toString();

    const handleLocationUpdate = () => {
        const mcpRequest = {
            jsonrpc: "2.0",
            id: 1,
            method: "tools/call",
            params: {
                name: "update",
                coords: {
                    latitude: locationData.latitude,
                    longitude: locationData.longitude
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

        setMcpRequest(request);
    };

    const handleLocationQuery = () => {
        const mcpRequest = {
            jsonrpc: "2.0",
            id: 1,
            method: "tools/call",
            params: {
                name: "query",
            }
        };

        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mcpRequest),
        };

        setMcpRequest(request);
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
                <Card>
                    <CardBody>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                                <ArrowUpIcon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold">Update Location</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Latitude
                                </label>
                                <input
                                    id="latitude"
                                    type="number"
                                    value={locationData.latitude}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                                    step="any"
                                    placeholder="40.7128"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Longitude
                                </label>
                                <input
                                    id="longitude"
                                    type="number"
                                    value={locationData.longitude}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                                    step="any"
                                    placeholder="-74.0060"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            
                            <Button
                                onClick={handleLocationUpdate}
                                className="w-full"
                                color="primary"
                            >
                                Update Location
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Location Query Form */}
                <Card>
                    <CardBody>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                                <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold">Query Location</h3>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Click the button below to query the current location data.
                        </p>
                        
                        <Button
                            onClick={handleLocationQuery}
                            className="w-full"
                            color="success"
                        >
                            Query Location
                        </Button>
                    </CardBody>
                </Card>
            </div>

            {/* JsonRpcDebug Component for Update Location */}
            {mcpRequest && (
                <div className="mt-6">
                    <JsonRpcDebug
                        url={mcpEndpoint}
                        request={mcpRequest}
                        onResult={handleMcpResult}
                    />
                </div>
            )}
        </Page>
    );
};

export default McpLocationPage;
