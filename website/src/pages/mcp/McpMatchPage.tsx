import React, { useState } from 'react';
import { Page, Card, CardBody, Button } from '@/components';
import { UserGroupIcon, MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

interface BusinessData {
    name: string;
    description: string;
    category: string;
    address: string;
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

const McpMatchPage = () => {
    const [businessData, setBusinessData] = useState<BusinessData>({
        name: '',
        description: '',
        category: 'restaurant',
        address: '',
        latitude: 40.7128,
        longitude: -74.0060
    });
    const [searchCriteria, setSearchCriteria] = useState({
        category: '',
        name: '',
        radius: 10
    });
    const [addResult, setAddResult] = useState<string>('');
    const [searchResult, setSearchResult] = useState<string>('');
    const [isAdding, setIsAdding] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const handleBusinessAdd = async () => {
        if (!businessData.name || !businessData.description || !businessData.address) {
            setAddResult('Please fill in all required fields');
            return;
        }

        setIsAdding(true);
        setAddResult('Adding business...');

        try {
            const mcpRequest = {
                jsonrpc: "2.0",
                id: 1,
                method: "tools/call",
                params: {
                    name: "business_add",
                    business: businessData
                }
            };

            const response = await fetch('/mcp/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mcpRequest),
            });

            if (response.ok) {
                const data: MCPResponse = await response.json();
                if (data.result?.content?.[0]?.text) {
                    setAddResult(data.result.content[0].text);
                } else if (data.error) {
                    setAddResult(`Error: ${data.error.message}`);
                } else {
                    setAddResult('Business added successfully');
                }
            } else {
                setAddResult(`HTTP Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            setAddResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsAdding(false);
        }
    };

    const handleBusinessSearch = async () => {
        setIsSearching(true);
        setSearchResult('Searching businesses...');

        try {
            const mcpRequest = {
                jsonrpc: "2.0",
                id: 1,
                method: "tools/call",
                params: {
                    name: "business_find",
                    criteria: {
                        category: searchCriteria.category || undefined,
                        name: searchCriteria.name || undefined,
                        location: {
                            latitude: 40.7128,
                            longitude: -74.0060,
                            radius: searchCriteria.radius
                        }
                    }
                }
            };

            const response = await fetch('/mcp/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mcpRequest),
            });

            if (response.ok) {
                const data: MCPResponse = await response.json();
                if (data.result?.content?.[0]?.text) {
                    setSearchResult(data.result.content[0].text);
                } else if (data.error) {
                    setSearchResult(`Error: ${data.error.message}`);
                } else {
                    setSearchResult('No businesses found');
                }
            } else {
                setSearchResult(`HTTP Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            setSearchResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsSearching(false);
        }
    };

    const clearResults = () => {
        setAddResult('');
        setSearchResult('');
    };

    const resetBusinessForm = () => {
        setBusinessData({
            name: '',
            description: '',
            category: 'restaurant',
            address: '',
            latitude: 40.7128,
            longitude: -74.0060
        });
    };

    return (
        <Page
            title="Match MCP Service"
            subtitle="Test business matching and connection services"
        >
            <div className="grid gap-6 md:grid-cols-2">
                {/* Business Add Form */}
                <Card>
                    <CardBody>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                                <PlusIcon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold">Add Business</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Business Name *
                                </label>
                                <input
                                    id="businessName"
                                    type="text"
                                    value={businessData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusinessData(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Enter business name"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    id="businessDescription"
                                    value={businessData.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBusinessData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Enter business description"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="businessCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category
                                </label>
                                <select
                                    id="businessCategory"
                                    value={businessData.category}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBusinessData(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="restaurant">Restaurant</option>
                                    <option value="retail">Retail</option>
                                    <option value="service">Service</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="entertainment">Entertainment</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Address *
                                </label>
                                <input
                                    id="businessAddress"
                                    type="text"
                                    value={businessData.address}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusinessData(prev => ({ ...prev, address: e.target.value }))}
                                    placeholder="Enter business address"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="businessLatitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Latitude
                                    </label>
                                    <input
                                        id="businessLatitude"
                                        type="number"
                                        value={businessData.latitude}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusinessData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                                        step="any"
                                        placeholder="40.7128"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="businessLongitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Longitude
                                    </label>
                                    <input
                                        id="businessLongitude"
                                        type="number"
                                        value={businessData.longitude}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusinessData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                                        step="any"
                                        placeholder="-74.0060"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex space-x-2">
                                <Button
                                    onClick={resetBusinessForm}
                                    variant="ghost"
                                    color="neutral"
                                    className="flex-1"
                                >
                                    Reset
                                </Button>
                                <Button
                                    onClick={handleBusinessAdd}
                                    disabled={isAdding}
                                    className="flex-1"
                                    color="primary"
                                >
                                    {isAdding ? 'Adding...' : 'Add Business'}
                                </Button>
                            </div>
                        </div>
                        
                        {addResult && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Result:</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{addResult}</p>
                            </div>
                        )}
                    </CardBody>
                </Card>

                {/* Business Search Form */}
                <Card>
                    <CardBody>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                                <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold">Search Businesses</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="searchCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category
                                </label>
                                <select
                                    id="searchCategory"
                                    value={searchCriteria.category}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSearchCriteria(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                >
                                    <option value="">All Categories</option>
                                    <option value="restaurant">Restaurant</option>
                                    <option value="retail">Retail</option>
                                    <option value="service">Service</option>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="entertainment">Entertainment</option>
                                </select>
                            </div>
                            
                            <div>
                                <label htmlFor="searchName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Business Name
                                </label>
                                <input
                                    id="searchName"
                                    type="text"
                                    value={searchCriteria.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchCriteria(prev => ({ ...prev, name: e.target.value }))}
                                    placeholder="Search by name (optional)"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="searchRadius" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Search Radius (km)
                                </label>
                                <input
                                    id="searchRadius"
                                    type="number"
                                    value={searchCriteria.radius}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchCriteria(prev => ({ ...prev, radius: parseInt(e.target.value) || 10 }))}
                                    min="1"
                                    max="100"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            
                            <Button
                                onClick={handleBusinessSearch}
                                disabled={isSearching}
                                className="w-full"
                                color="success"
                            >
                                {isSearching ? 'Searching...' : 'Search Businesses'}
                            </Button>
                        </div>
                        
                        {searchResult && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Result:</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{searchResult}</p>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </div>

            {/* Clear Results Button */}
            {(addResult || searchResult) && (
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

            {/* Service Information */}
            <Card className="mt-6">
                <CardBody>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                            <UserGroupIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">Match MCP Service</h3>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                        <p>
                            <strong>Endpoint:</strong> <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">/mcp/match</code>
                        </p>
                        <p>
                            <strong>Available Tools:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li><strong>business_add:</strong> Add a new business to the matching system</li>
                            <li><strong>business_find:</strong> Find businesses based on criteria like category, name, and location</li>
                        </ul>
                        <p>
                            <strong>Features:</strong> The service supports location-based business matching, allowing users to find businesses within a specified radius and filter by category and name.
                        </p>
                    </div>
                </CardBody>
            </Card>
        </Page>
    );
};

export default McpMatchPage;
