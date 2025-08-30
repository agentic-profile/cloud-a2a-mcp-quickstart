import { Avatar } from '@heroui/react';
import { Button, Card, CardBody, Page } from '@/components';
import agentsData from '@/data/agents.json';

interface Agent {
    id: string;
    name: string;
    description: string;
    avatar: string;
    route: string;
    agentUrl: string;
}

const AgentsPage = () => {
    // Import agents data from the JSON file
    const agents: Agent[] = agentsData;

    const handleAgentAction = (agent: Agent) => {
        if (agent.route) {
            // Navigate to the agent's detailed page
            window.location.href = agent.route;
        } else {
            // Default chat action
            console.log(`Starting chat with ${agent.name}`);
        }
    };

    const handleChatClick = (agent: Agent) => {
        // Navigate to ChatPage with agentUrl parameter
        if (agent.agentUrl) {
            window.location.href = `/chat?agentUrl=${encodeURIComponent(agent.agentUrl)}`;
        } else {
            // Fallback to regular chat page
            window.location.href = '/chat';
        }
    };
    
    return (
        <Page
            title={`AI Agents (${agents.length})`}
            subtitle="Connect with specialized AI agents for various tasks and expertise areas"
        >
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {agents.map((agent) => (
                    <Card key={agent.id} className="w-full">
                        <CardBody>
                            <Avatar
                                name={agent.avatar}
                                size="lg"
                                className="text-lg font-bold"
                            />

                            <h3 className="text-lg font-semibold">
                                {agent.name}
                            </h3>

                            <p className="text-foreground-500 mb-3">
                                {agent.description}
                            </p>
                            
                            {/* Action Buttons */}
                            <div className="flex space-x-2 mt-4">
                                <Button
                                    color="primary"
                                    size="sm"
                                    onClick={() => handleAgentAction(agent)}
                                >
                                    Details
                                </Button>
                                <Button
                                    color="secondary"
                                    size="sm"
                                    onClick={() => handleChatClick(agent)}
                                >
                                    Chat
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </Page>
    );
};

export default AgentsPage;
