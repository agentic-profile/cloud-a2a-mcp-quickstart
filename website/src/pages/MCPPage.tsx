import React from 'react';
import { 
    ServerIcon, 
    WrenchScrewdriverIcon,
    GlobeAltIcon,
    CloudIcon,
    CircleStackIcon,
    CpuChipIcon,
    BoltIcon,
    CheckCircleIcon,
    BugAntIcon
} from '@heroicons/react/24/outline';
import { Chip } from '@heroui/react';
import { Page, Card, CardBody, Button } from '@/components';
import { Link } from 'react-router-dom';

interface MCPService {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
    category: string;
    status: 'active' | 'inactive' | 'maintenance';
    version: string;
    endpoints: string[];
    features: string[];
}

const MCPPage = () => {
    // Mock data - in a real app this would come from an API
    const mcpServices: MCPService[] = [
        {
            id: '1',
            name: 'AWS Serverless',
            description: 'Access AWS services including Lambda, DynamoDB, S3, and more through MCP',
            icon: CloudIcon,
            category: 'Cloud Services',
            status: 'active',
            version: '1.2.0',
            endpoints: ['/aws/lambda', '/aws/dynamodb', '/aws/s3'],
            features: ['Serverless Functions', 'Database Operations', 'File Storage', 'API Gateway']
        },
        {
            id: '2',
            name: 'Database Connector',
            description: 'Connect to various databases including PostgreSQL, MySQL, and MongoDB',
            icon: CircleStackIcon,
            category: 'Database',
            status: 'active',
            version: '2.1.0',
            endpoints: ['/db/query', '/db/connect', '/db/schema'],
            features: ['SQL Queries', 'Connection Management', 'Schema Discovery', 'Transaction Support']
        },
        {
            id: '3',
            name: 'File System',
            description: 'Access and manipulate files on local and remote file systems',
            icon: ServerIcon,
            category: 'File System',
            status: 'active',
            version: '1.0.5',
            endpoints: ['/fs/read', '/fs/write', '/fs/list', '/fs/delete'],
            features: ['File Reading', 'File Writing', 'Directory Listing', 'File Operations']
        },
        {
            id: '4',
            name: 'Web Scraping',
            description: 'Extract data from websites and web applications',
            icon: GlobeAltIcon,
            category: 'Web Tools',
            status: 'maintenance',
            version: '1.8.2',
            endpoints: ['/web/scrape', '/web/parse', '/web/validate'],
            features: ['HTML Parsing', 'Data Extraction', 'Rate Limiting', 'Proxy Support']
        },
        {
            id: '5',
            name: 'AI Models',
            description: 'Access various AI models for text generation, image analysis, and more',
            icon: CpuChipIcon,
            category: 'AI/ML',
            status: 'active',
            version: '3.0.1',
            endpoints: ['/ai/generate', '/ai/analyze', '/ai/embed'],
            features: ['Text Generation', 'Image Analysis', 'Embeddings', 'Model Management']
        },
        {
            id: '6',
            name: 'Task Management',
            description: 'Create, assign, and track tasks across different projects and teams',
            icon: WrenchScrewdriverIcon,
            category: 'Productivity',
            status: 'active',
            version: '2.3.0',
            endpoints: ['/tasks/create', '/tasks/assign', '/tasks/update', '/tasks/complete'],
            features: ['Task Creation', 'Assignment', 'Progress Tracking', 'Notifications']
        }
    ];

    const getStatusColor = (status: MCPService['status']) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'maintenance':
                return 'warning';
            case 'inactive':
                return 'danger';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: MCPService['status']) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'maintenance':
                return 'Maintenance';
            case 'inactive':
                return 'Inactive';
            default:
                return 'Unknown';
        }
    };

    const getCategoryColor = (category: string): "default" | "success" | "warning" | "danger" | "secondary" | "primary" => {
        const colors: Record<string, "default" | "success" | "warning" | "danger" | "secondary" | "primary"> = {
            'Cloud Services': 'secondary',
            'Database': 'success',
            'File System': 'secondary',
            'Web Tools': 'warning',
            'AI/ML': 'danger',
            'Productivity': 'primary'
        };
        return colors[category] || 'default';
    };

    return (
        <Page
            title="MCP Services"
            subtitle="Manage and interact with Model Context Protocol services for extended functionality"
            maxWidth="6xl"
        >
            {/* JSON RPC Debug Link */}
            <div className="mb-6">
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <CardBody>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    JSON RPC Debug Tool
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Test JSON RPC requests to your MCP agents with our interactive debug tool
                                </p>
                            </div>
                            <Link to="/mcp/debug">
                                <Button color="primary" size="lg">
                                    <BugAntIcon className="w-5 h-5 mr-2" />
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
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                    <service.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {service.name}
                                    </h3>
                                    <Chip
                                        size="sm"
                                        color={getCategoryColor(service.category)}
                                        variant="flat"
                                    >
                                        {service.category}
                                    </Chip>
                                </div>
                            </div>
                            <Chip
                                size="sm"
                                color={getStatusColor(service.status)}
                                variant="flat"
                            >
                                {getStatusText(service.status)}
                            </Chip>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {service.description}
                        </p>

                        {/* Version */}
                        <div className="flex items-center space-x-2 mb-4 text-sm text-gray-500 dark:text-gray-400">
                            <BoltIcon className="w-4 h-4" />
                            <span>v{service.version}</span>
                        </div>

                        {/* Features */}
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Features:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                                {service.features.slice(0, 3).map((feature, index) => (
                                    <Chip
                                        key={index}
                                        size="sm"
                                        color="secondary"
                                        variant="flat"
                                        startContent={<CheckCircleIcon className="w-3 h-3" />}
                                    >
                                        {feature}
                                    </Chip>
                                ))}
                                {service.features.length > 3 && (
                                    <Chip
                                        size="sm"
                                        color="secondary"
                                        variant="flat"
                                    >
                                        +{service.features.length - 3} more
                                    </Chip>
                                )}
                            </div>
                        </div>

                        {/* Endpoints */}
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Endpoints:
                            </h4>
                            <div className="space-y-1">
                                {service.endpoints.slice(0, 2).map((endpoint, index) => (
                                    <div key={index} className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                                        {endpoint}
                                    </div>
                                ))}
                                {service.endpoints.length > 2 && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        +{service.endpoints.length - 2} more endpoints
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2">
                            <Button variant="primary" className="flex-1">
                                <WrenchScrewdriverIcon className="w-4 h-4 mr-2" />
                                Configure
                            </Button>
                            <Button variant="ghost" className="flex-1">
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
