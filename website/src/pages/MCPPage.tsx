import React from 'react';
import { 
    ServerIcon, 
    WrenchScrewdriverIcon,
    GlobeAltIcon,
    CloudIcon,
    CircleStackIcon,
    CpuChipIcon,
    BoltIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';
import Page from '@/components/Page';

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
                return 'bg-green-500';
            case 'maintenance':
                return 'bg-yellow-500';
            case 'inactive':
                return 'bg-red-500';
            default:
                return 'bg-gray-400';
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

    const getCategoryColor = (category: string) => {
        const colors = {
            'Cloud Services': 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200',
            'Database': 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200',
            'File System': 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200',
            'Web Tools': 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200',
            'AI/ML': 'bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-200',
            'Productivity': 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-200'
        };
        return colors[category as keyof typeof colors] || 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200';
    };

    return (
        <Page
            title="MCP Services"
            subtitle="Manage and interact with Model Context Protocol services for extended functionality"
            maxWidth="6xl"
        >

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mcpServices.map((service) => (
                    <div
                        key={service.id}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200"
                    >
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
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                                        {service.category}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 ${getStatusColor(service.status)} rounded-full`} />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {getStatusText(service.status)}
                                </span>
                            </div>
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
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                    >
                                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                                        {feature}
                                    </span>
                                ))}
                                {service.features.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                        +{service.features.length - 3} more
                                    </span>
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
                            <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                                <WrenchScrewdriverIcon className="w-4 h-4 mr-2" />
                                Configure
                            </button>
                            <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                                <ServerIcon className="w-4 h-4 mr-2" />
                                Test
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </Page>
    );
};

export default MCPPage;
