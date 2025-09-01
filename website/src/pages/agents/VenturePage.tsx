import { 
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Button, Card, CardBody, Page, JsonRpcDebug } from '@/components';
import agentsData from '@/data/agents.json';
import { useState } from 'react';

const VenturePage = () => {
    // Find the venture agent from the agents data
    const ventureAgent = agentsData.find(agent => agent.id === 'venture');
    
    // State for JSON RPC debugging
    const [request, setRequest] = useState<any>(null);
    
    const handleChatClick = () => {
        if (ventureAgent?.agentUrl) {
            // Navigate to ChatPage with the venture agent's agentUrl parameter
            window.location.href = `/chat?agentUrl=${encodeURIComponent(ventureAgent.agentUrl)}`;
        } else {
            // Fallback to regular chat page
            window.location.href = '/chat';
        }
    };

    const handleJsonRpcResult = (result: any) => {
        console.log('JSON RPC Result:', result);
    };

    const handleSendRequest = () => {
        if (!ventureAgent?.agentUrl) {
            return;
        }

        // Sample JSON RPC payload for testing
        const jsonRpcRequest = {
            jsonrpc: '2.0',
            id: Date.now().toString(),
            method: 'tools/list',
            params: { name: 'venture' }
        };

        // Set the request - this will automatically trigger JsonRpcDebug to send it
        setRequest(jsonRpcRequest);
    };

    if (!ventureAgent) {
        return (
            <Page
                title="Venture Agent"
                subtitle="Agent not found"
                maxWidth="6xl"
            >
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Venture Agent data not found. Please check the agents configuration.
                    </p>
                </div>
            </Page>
        );
    }

    return (
        <Page
            title={ventureAgent.name}
            subtitle="Your AI-powered business development partner for strategic growth and partnerships"
            maxWidth="6xl"
        >
            <div className="text-center">
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <CardBody>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Ready to Accelerate Your Business Growth?
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                            Let the Venture Agent help you build strategic partnerships and unlock new opportunities
                        </p>
                    </CardBody>
                </Card>
            </div>

            {/* Chat Button */}
            <div className="mt-8 text-center">
                <Button
                    color="success"
                    size="lg"
                    onClick={handleChatClick}
                >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                    Start Chat
                </Button>
            </div>

            {/* JSON RPC Debug Section */}
            {ventureAgent.agentUrl && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
                        JSON RPC Debug
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                        Test JSON RPC requests to the Venture Agent
                    </p>
                    
                    {/* Send Request Button */}
                    <div className="text-center mb-6">
                        <Button
                            onClick={handleSendRequest}
                            color="primary"
                            size="lg"
                        >
                            Test Tools List Request
                        </Button>
                    </div>
                    
                    <JsonRpcDebug
                        url={ventureAgent.agentUrl}
                        request={request}
                        onFinalResult={handleJsonRpcResult}
                    />
                </div>
            )}
        </Page>
    );
};

export default VenturePage;
