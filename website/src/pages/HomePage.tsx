import { Link } from 'react-router-dom';
import { 
    ChatBubbleLeftRightIcon, 
    ShieldCheckIcon, 
    GlobeAltIcon,
    ArrowRightIcon 
} from '@heroicons/react/24/outline';

const HomePage = () => {
    const features = [
        {
            icon: ChatBubbleLeftRightIcon,
            title: 'Trust and Accountability',
            description: 'Any agent must be able to prove its identity to any other agent in the Agentic Economy. ' +
            'With identity verification, agents can be held accountable for their actions and develop reputation.'
        },
        {
            icon: ShieldCheckIcon,
            title: 'Reliability, Availability, and Scalability',
            description: 'Agents must be able to operate in a decentralized and fault-tolerant manner.'
        },
        {
            icon: GlobeAltIcon,
            title: 'Standards and Interoperability',
            description: 'Agents must be able to communicate with each other.'
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <main className="flex-1 w-full max-w-full overflow-hidden">
                <div className="relative w-full max-w-full overflow-hidden">
                    <div className="w-full max-w-full">
                        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                            <div className="mt-10 mx-auto w-full max-w-full px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                                <div className="sm:text-center lg:text-left">
                                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                                        <span className="block xl:inline">Welcome to the </span>{' '}
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 xl:inline">
                                            Agentic Economy
                                        </span>
                                    </h1>
                                    <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                        This open-source quickstart makes it easy to deploy scalable A2A and MCP services
                                        on popular cloud providers.
                                    </p>
                                    <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                        Quickstart examples support global discovery, decentralized
                                        authentication, and transactions in the Agentic Economy.
                                    </p>
                                    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                        <div className="mt-3 sm:mt-0 sm:ml-3">
                                            <a
                                                href="#features"
                                                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/20 hover:bg-purple-200 dark:hover:bg-purple-900/30 md:py-4 md:text-lg md:px-10 transition-colors duration-200"
                                            >
                                                Learn More
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="py-12 bg-white dark:bg-gray-800 w-full max-w-full">
                    <div className="w-full max-w-full px-4 sm:px-6 lg:px-8">
                        <div className="lg:text-center">
                            <h2 className="text-base text-purple-600 dark:text-purple-400 font-semibold tracking-wide uppercase">
                                Features
                            </h2>
                            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                Key Ingredients of the Agentic Economy
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
                                There are many great agent orchestration frameworks like LangChain and CrewAI.  These frameworks
                                enable the composition of cooperative agents with established authentication systems.
                            </p>
                            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
                                <b>The Agentic Economy will flourish</b> when an agent built in one orchestration framework can discover,
                                authenticate, and transact with agents built in other frameworks and representing other
                                entities such as people, businesses, and governments.
                            </p>
                        </div>

                        <div className="mt-10">
                            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                                {features.map((feature) => (
                                    <div key={feature.title} className="relative">
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-purple-500 text-white">
                                            <feature.icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                            {feature.title}
                                        </p>
                                        <p className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-full max-w-full">
                    <div className="w-full max-w-full mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            <span className="block">Ready to get started?</span>
                            <span className="block">Start chatting with our agents today.</span>
                        </h2>
                        <p className="mt-4 text-lg leading-6 text-purple-100">
                            Join thousands of users already experiencing the future of AI.
                        </p>
                        <Link
                            to="/chat"
                            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-gray-50 sm:w-auto transition-colors duration-200"
                        >
                            Get Started
                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
};

export default HomePage;
