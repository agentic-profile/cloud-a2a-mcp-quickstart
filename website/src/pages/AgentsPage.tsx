import { 
    ChatBubbleLeftRightIcon,
    StarIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

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
                return 'bg-green-500';
            case 'busy':
                return 'bg-yellow-500';
            case 'offline':
                return 'bg-gray-400';
            default:
                return 'bg-gray-400';
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

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    AI Agents
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Connect with specialized AI agents for various tasks and expertise areas
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                {agents.map((agent) => (
                    <div
                        key={agent.id}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200"
                    >
                        <div className="flex items-start space-x-4">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {agent.avatar}
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(agent.status)} rounded-full border-2 border-white dark:border-gray-800`} />
                            </div>

                            {/* Agent Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {agent.name}
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <StarIcon className="w-5 h-5 text-yellow-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {agent.rating}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                    {agent.description}
                                </p>

                                {/* Specialties */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {agent.specialties.map((specialty, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                </div>

                                {/* Status and Last Seen */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            agent.status === 'online' 
                                                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                                                : agent.status === 'busy'
                                                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                                                : 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200'
                                        }`}>
                                            {getStatusText(agent.status)}
                                        </span>
                                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                            <ClockIcon className="w-4 h-4" />
                                            <span>{agent.lastSeen}</span>
                                        </div>
                                    </div>

                                    {/* Chat Button */}
                                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                                        <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                                        Chat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentsPage;
