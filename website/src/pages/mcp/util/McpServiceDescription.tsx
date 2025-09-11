import { Card, CardBody, LabelValue } from '@/components';
import type { MCPService } from '../types';

interface McpServiceDescriptionProps {
    service: MCPService;
    endpoint: string | undefined;
    tools: Array<{
        name: string;
        description: string;
    }>;
    dataFormat: string;
}

const McpServiceDescription = ({ 
    service, 
    endpoint, 
    tools, 
    dataFormat 
}: McpServiceDescriptionProps) => {
    const IconComponent = service.icon;

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
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        {tools.map((tool, index) => (
                            <li key={index}>
                                <strong>{tool.name}:</strong> {tool.description}
                            </li>
                        ))}
                    </ul>
                    <p>
                        <strong>Data Format:</strong> {dataFormat}
                    </p>
                </div>
            </CardBody>
        </Card>
    );
};

export default McpServiceDescription;
