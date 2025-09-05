import React from 'react';
import { 
    ServerIcon, 
    CloudIcon
} from '@heroicons/react/24/outline';
import { Page, Card, CardBody, Button } from '@/components';
import { Link, useNavigate } from 'react-router-dom';

interface MCPService {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
    route: string;
}

const MCPPage = () => {
    const navigate = useNavigate();
    
    // Mock data - in a real app this would come from an API
    const mcpServices: MCPService[] = [
        {
            id: '1',
            name: 'Location',
            description: 'Find other people or businesses near you',
            icon: CloudIcon,
            route: '/mcp/location'
        },
        /*{
            id: '2',
            name: 'Match',
            description: 'Connect with similar people',
            icon: CircleStackIcon,
            route: '/mcp/match'
        }*/
    ];

    const handleTestService = (route: string) => {
        navigate(route);
    };

    return (
        <Page
            title="MCP Services"
            subtitle="Manage and interact with Model Context Protocol services for extended functionality"
        >
            {/* JSON RPC Debug Link */}
            <div className="mb-6">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3>
                                    JSON RPC Debug Tool
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Test JSON RPC requests to your MCP agents with our interactive debug tool
                                </p>
                            </div>
                            <Link to="/mcp/debug">
                                <Button color="primary">
                                    Open Debug Tool
                                </Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mcpServices.map((service) => (
                    <Card
                        key={service.id}
                        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-200"
                    >
                        <CardBody>
                        {/* Header */}
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                <service.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3>
                                {service.name}
                            </h3>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {service.description}
                        </p>

                        {/* Actions */}
                        <div className="flex space-x-2">
                            <Button 
                                variant="ghost" 
                                className="flex-1"
                                onClick={() => handleTestService(service.route)}
                            >
                                <ServerIcon className="w-4 h-4 mr-2" />
                                Test
                            </Button>
                        </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </Page>
    );
};

export default MCPPage;
