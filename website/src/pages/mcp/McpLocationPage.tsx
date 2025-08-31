import React, { useState } from 'react';
import { Page, Card, CardBody, Button, JsonRpcDebug } from '@/components';
import { MapPinIcon, MagnifyingGlassIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

interface LocationData {
    latitude: number;
    longitude: number;
}

interface MCPResponse {
    jsonrpc: string;
    id: number;
    result?: {
        content: Array<{
            type: string;
            text: string;
        }>;
    };
    error?: {
        code: number;
        message: string;
    };
}

interface Result {
    fetchResponse: Response | undefined;
    text: string | undefined;
    data: any | undefined;
    error: unknown;
}

const McpLocationPage = () => {
    const [locationData, setLocationData] = useState<LocationData>({
        latitude: 40.7128,
        longitude: -74.0060
    });
    const [queryResult, setQueryResult] = useState<string>('');
    const [isQuerying, setIsQuerying] = useState(false);
    const [showUpdateDebug, setShowUpdateDebug] = useState(false);
    const [updateRequest, setUpdateRequest] = useState<RequestInit | null>(null);

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

        setUpdateRequest(request);
        setShowUpdateDebug(true);
    };

    const handleLocationQuery = async () => {
        setIsQuerying(true);
        setQueryResult('Querying location...');

        try {
            const mcpRequest = {
                jsonrpc: "2.0",
                id: 1,
                method: "tools/call",
                params: {
                    name: "query",
                }
            };

            const response = await fetch('/mcp/location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mcpRequest),
            });

            if (response.ok) {
                const data: MCPResponse = await response.json();
                if (data.result?.content?.[0]?.text) {
                    setQueryResult(data.result.content[0].text);
                } else if (data.error) {
                    setQueryResult(`Error: ${data.error.message}`);
                } else {
                    setQueryResult('No location data found');
                }
            } else {
                setQueryResult(`HTTP Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            setQueryResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsQuerying(false);
        }
    };

    const clearResults = () => {
        setQueryResult('');
        setShowUpdateDebug(false);
        setUpdateRequest(null);
    };

    const handleUpdateResult = (result: Result) => {
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
                        <p>
                            <strong>Endpoint:</strong> <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">/mcp/location</code>
                        </p>
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
                            disabled={isQuerying}
                            className="w-full"
                            color="success"
                        >
                            {isQuerying ? 'Querying...' : 'Query Location'}
                        </Button>
                        
                        {queryResult && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Result:</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{queryResult}</p>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* JsonRpcDebug Component for Update Location */}
            {showUpdateDebug && updateRequest && (
                <div className="mt-6">
                    <JsonRpcDebug
                        url="/mcp/location"
                        request={updateRequest}
                        onResult={handleUpdateResult}
                    />
                </div>
            )}

            {/* Clear Results Button */}
            {(queryResult || showUpdateDebug) && (
                <div className="mt-6 flex justify-center">
                    <Button
                        onClick={clearResults}
                        variant="ghost"
                        color="neutral"
                    >
                        Clear Results
                    </Button>
                </div>
            )}
        </Page>
    );
};

export default McpLocationPage;
