import { 
    ChatBubbleLeftRightIcon,
    StarIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody } from '@/components/Card';
import { Avatar, Chip, Button } from '@heroui/react';
import Page from '@/components/Page';

interface Agent {
    id: string;
    name: string;
    description: string;
    avatar: string;
    status: 'online' | 'offline' | 'busy';
    rating: number;
    lastSeen: string;
    specialties: string[];
}

const AgentsPage = () => {
    // Mock data - in a real app this would come from an API
    const agents: Agent[] = [
        {
            id: '1',
            name: 'Alex Chen',
            description: 'AI Research Specialist with expertise in machine learning and neural networks',
            avatar: 'AC',
            status: 'online',
            rating: 4.8,
            lastSeen: '2 minutes ago',
            specialties: ['Machine Learning', 'AI Research', 'Data Science']
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            description: 'Business Strategy Consultant helping startups scale and grow',
            avatar: 'SJ',
            status: 'busy',
            rating: 4.9,
            lastSeen: '15 minutes ago',
            specialties: ['Business Strategy', 'Startup Growth', 'Market Analysis']
        },
        {
            id: '3',
            name: 'Marcus Rodriguez',
            description: 'Blockchain Developer specializing in DeFi and smart contracts',
            avatar: 'MR',
            status: 'online',
            rating: 4.7,
            lastSeen: '1 minute ago',
            specialties: ['Blockchain', 'DeFi', 'Smart Contracts']
        },
        {
            id: '4',
            name: 'Dr. Emily Watson',
            description: 'Healthcare AI researcher focused on medical diagnostics and patient care',
            avatar: 'EW',
            status: 'offline',
            rating: 4.9,
            lastSeen: '2 hours ago',
            specialties: ['Healthcare AI', 'Medical Diagnostics', 'Patient Care']
        },
        {
            id: '5',
            name: 'David Kim',
            description: 'Cybersecurity expert with deep knowledge of threat detection and prevention',
            avatar: 'DK',
            status: 'online',
            rating: 4.6,
            lastSeen: '5 minutes ago',
            specialties: ['Cybersecurity', 'Threat Detection', 'Network Security']
        }
    ];

    const getStatusColor = (status: Agent['status']) => {
        switch (status) {
            case 'online':
                return 'success';
            case 'busy':
                return 'warning';
            case 'offline':
                return 'default';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: Agent['status']) => {
        switch (status) {
            case 'online':
                return 'Online';
            case 'busy':
                return 'Busy';
            case 'offline':
                return 'Offline';
            default:
                return 'Unknown';
        }
    };

    const getAvatarColor = (status: Agent['status']) => {
        switch (status) {
            case 'online':
                return 'success';
            case 'busy':
                return 'warning';
            case 'offline':
                return 'default';
            default:
                return 'default';
        }
    };

    console.log('AgentsPage rendering, agents count:', agents.length);
    
    return (
        <Page
            title={`AI Agents (${agents.length})`}
            subtitle="Connect with specialized AI agents for various tasks and expertise areas"
        >

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {agents.map((agent) => (
                    <Card key={agent.id} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
                        <CardBody>
                            <div className="flex items-start space-x-4">
                                {/* Avatar */}
                                <Avatar
                                    name={agent.avatar}
                                    size="lg"
                                    color={getAvatarColor(agent.status)}
                                    className="text-lg font-bold"
                                />

                                {/* Agent Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold">
                                            {agent.name}
                                        </h3>
                                        <div className="flex items-center space-x-2">
                                            <StarIcon className="w-5 h-5 text-yellow-400" />
                                            <span className="text-sm font-medium">
                                                {agent.rating}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-foreground-500 mb-3">
                                        {agent.description}
                                    </p>

                                    {/* Specialties */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {agent.specialties.map((specialty, index) => (
                                            <Chip
                                                key={index}
                                                size="sm"
                                                color="secondary"
                                                variant="flat"
                                            >
                                                {specialty}
                                            </Chip>
                                        ))}
                                    </div>

                                    {/* Status and Last Seen */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Chip
                                                size="sm"
                                                color={getStatusColor(agent.status)}
                                                variant="flat"
                                            >
                                                {getStatusText(agent.status)}
                                            </Chip>
                                            <div className="flex items-center space-x-1 text-sm text-foreground-500">
                                                <ClockIcon className="w-4 h-4" />
                                                <span>{agent.lastSeen}</span>
                                            </div>
                                        </div>

                                        {/* Chat Button */}
                                        <Button
                                            color="secondary"
                                            variant="solid"
                                            size="sm"
                                            startContent={<ChatBubbleLeftRightIcon className="w-4 h-4" />}
                                        >
                                            Chat
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </Page>
    );
};

export default AgentsPage;
