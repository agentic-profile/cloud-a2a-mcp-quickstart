import { Avatar } from '@heroui/react';
import { Button, Card, CardBody, Page } from '@/components';
import { Link } from 'react-router-dom';
import agentsData from '@/data/agents.json';
import { buildEndpoint } from '@/tools/misc';
import { useSettingsStore } from '@/stores';
import type { Agent } from '@/data/models';

const AgentsPage = () => {
    const { serverUrl } = useSettingsStore();
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
        const rpcUrl = serverUrl ? buildEndpoint(serverUrl, agent.agentUrl ) : null;
        if( rpcUrl )
            window.location.href = `/chat?rpcUrl=${encodeURIComponent(rpcUrl)}`;
    };
    
    return (
        <Page
            title={`AI Agents (${agents.length})`}
            subtitle="Connect with specialized AI agents for various tasks and expertise areas"
        >
            {/* A2A Debug Tool Link */}
            <div className="mb-6">
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <CardBody>
                        <div className="flex items-center justify-between space-x-2">
                            <div>
                                <h3>
                                    A2A Debug Tool
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Test and debug A2A (Agent-to-Agent) API endpoints for Venture, VC, and HireMe agents
                                </p>
                            </div>
                            <Link to="/a2a/debug">
                                <Button color="primary">
                                    Open Debug Tool
                                </Button>
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {agents.map((agent) => (
                    <Card key={agent.id} className="w-full">
                        <CardBody>
                            <Avatar
                                name={agent.avatar}
                                size="lg"
                                className="text-lg font-bold"
                            />

                            <h3>
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
                                {serverUrl && <Button
                                    color="secondary"
                                    size="sm"
                                    onClick={() => handleChatClick(agent)}
                                >
                                    Chat
                                </Button>}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </Page>
    );
};

export default AgentsPage;
