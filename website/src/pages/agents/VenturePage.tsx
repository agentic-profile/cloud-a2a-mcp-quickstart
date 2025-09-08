import { 
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Button, Card, CardBody, Page } from '@/components';
import agentsData from '@/data/agents.json';
import { buildEndpoint } from '@/tools/misc';
import { useSettingsStore } from '@/stores';

const VenturePage = () => {
    const { serverUrl } = useSettingsStore();
    // Find the venture agent from the agents data
    const ventureAgent = agentsData.find(agent => agent.id === 'venture');
    const rpcUrl = serverUrl && ventureAgent ? buildEndpoint(serverUrl, ventureAgent?.agentUrl ) : null;
    
    const handleChatClick = () => {
        if( rpcUrl )
            window.location.href = `/chat?rpcUrl=${encodeURIComponent(rpcUrl)}`;
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
            {rpcUrl && <div className="mt-8 text-center">
                <Button
                    color="success"
                    size="lg"
                    onClick={handleChatClick}
                >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                    Start Chat
                </Button>
            </div>}
        </Page>
    );
};

export default VenturePage;
