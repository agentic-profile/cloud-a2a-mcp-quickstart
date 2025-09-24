import { useEffect, useState } from 'react';
import { Card, CardBody, LabelValue } from '@/components';
import type { MCPService } from '../types';

interface McpServiceDescriptionProps {
    service: MCPService;
    endpoint: string | undefined;
}

interface MCPTool {
    name: string;
    description: string;
    inputSchema?: any;
}

const McpServiceDescription = ({ 
    service, 
    endpoint
}: McpServiceDescriptionProps) => {
    const IconComponent = service.icon;
    const [tools, setTools] = useState<MCPTool[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTools = async () => {
            if (!endpoint) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        id: 'tools-list',
                        method: 'tools/list',
                        params: {}
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.error) {
                    throw new Error(data.error.message || 'Failed to fetch tools');
                }

                if (data.result && data.result.tools) {
                    setTools(data.result.tools);
                } else {
                    setTools([]);
                }
            } catch (err) {
                console.error('Error fetching tools:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch tools');
                setTools([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTools();
    }, [endpoint]);

    return (
        <Card className="mb-6">
            <CardBody>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">{service.name} MCP Service</h3>
                </div>
                
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <LabelValue label="Endpoint" value={endpoint} />
                    <p>
                        <strong>Available Tools:</strong>
                    </p>
                    {loading && (
                        <p className="text-blue-600 dark:text-blue-400">Loading tools...</p>
                    )}
                    {error && (
                        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                    )}
                    {!loading && !error && (
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            {tools.length > 0 ? (
                                tools.map((tool, index) => (
                                    <li key={index}>
                                        <strong>{tool.name}:</strong> {tool.description}
                                    </li>
                                ))
                            ) : (
                                <li>No tools available</li>
                            )}
                        </ul>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

export default McpServiceDescription;
