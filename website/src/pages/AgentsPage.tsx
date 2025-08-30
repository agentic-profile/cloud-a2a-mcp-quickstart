import { Card, CardBody } from '@/components/Card';
import { Avatar } from '@heroui/react';
import Page from '@/components/Page';

interface Agent {
    id: string;
    name: string;
    description: string;
    avatar: string;
    route: string;
}

const AgentsPage = () => {
    // Agent definitions - in a real app this could be dynamically loaded from the agents directory
    const agents: Agent[] = [
        {
            id: 'venture',
            name: 'Venture Agent',
            description: 'Your AI-powered business development partner that learns your business model and strategically connects you with VCs, co-founders, new hires, and technology partners.',
            avatar: 'VA',
            route: '/agents/venture'
        }
    ];

    const handleAgentAction = (agent: Agent) => {
        if (agent.route) {
            // Navigate to the agent's detailed page
            window.location.href = agent.route;
        } else {
            // Default chat action
            console.log(`Starting chat with ${agent.name}`);
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
                        <CardBody 
                            onClick={() => handleAgentAction(agent)}
                            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
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
                        </CardBody>
                    </Card>
                ))}
            </div>
        </Page>
    );
};

export default AgentsPage;
