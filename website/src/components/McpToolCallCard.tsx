import { useState, type ReactNode } from 'react';
import { Card, CardBody, Button, HttpProgressSummary } from '@/components';
import { type HttpProgress, type HttpRequest } from '@/components/JsonRpcDebug';

interface McpToolCallCardProps {
    title: string;
    icon: ReactNode;
    description?: string;
    buttonText: string;
    children?: ReactNode;
    createMcpRequest: () => McpRequest | undefined;
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

interface McpRequest {
    method: string;
    params: any;
}

const McpToolCallCard = ({ 
    title,
    icon,
    description,
    buttonText,
    children,
    createMcpRequest,
    onSubmitHttpRequest
}: McpToolCallCardProps) => {
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);

    const handleSubmit = () => {
        const mcpRequest = createMcpRequest();
        if (!mcpRequest)
            return;

        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mcpRequest),
        };

        onSubmitHttpRequest({
            requestInit: request,
            onProgress: setHttpProgress
        });
    };

    return (
        <Card>
            <CardBody>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        {icon}
                    </div>
                    <h3>{title}</h3>
                </div>
                
                {description && (
                    <p className="sm mb-4">
                        {description}
                    </p>
                )}
                
                <div className="space-y-4 mb-4">
                    {children}
                </div>
                
                <Button
                    onClick={handleSubmit}
                    className="w-full"
                    color="primary"
                >
                    {buttonText}
                </Button>

                <HttpProgressSummary progress={httpProgress} />
            </CardBody>
        </Card>
    );
};

export default McpToolCallCard;
