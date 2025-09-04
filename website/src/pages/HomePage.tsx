import { Link } from 'react-router-dom';
import { 
    ChatBubbleLeftRightIcon, 
    ShieldCheckIcon, 
    GlobeAltIcon,
    ArrowRightIcon 
} from '@heroicons/react/24/outline';
import { Button, ThemeToggle } from '@/components';

const HomePage = () => {
    const features = [
        {
            icon: ChatBubbleLeftRightIcon,
            title: 'Trust and Accountability',
            description: 'Every agent must be able to prove who it represents to any other agent in the Agentic Economy. ' +
            'With identity verification, agents can be held accountable for their actions and develop reputation.'
        },
        {
            icon: ShieldCheckIcon,
            title: 'Reliability, Availability, and Scalability',
            description: 'Agents must be able to leverage best in class cloud services to seamlessly scale to millions of transactions per second, while maintaining high security.'
        },
        {
            icon: GlobeAltIcon,
            title: 'Standards and Interoperability',
            description: 'Agents must be able to communicate with each other, and to discovery and use tools available across the Internet.'
        }
    ];

    const scrollToFeatures = () => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <>
            {/* Mobile Theme Toggle - Top Right */}
            <div className="lg:hidden fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* Hero Section */}
            <main className="flex-1 w-full max-w-full overflow-hidden">
                <div className="relative w-full max-w-full overflow-hidden">
                    <div className="w-full max-w-full">
                        <div className="relative z-10 flex items-center justify-center min-h-screen pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
                            <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
                                <div className="text-center">
                                    <h1 className="text-4xl tracking-tight font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl leading-tight">
                                        <span className="block xl:inline">Welcome to the </span>{' '}
                                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 xl:inline leading-tight">
                                            Agentic Economy
                                        </span>
                                    </h1>
                                    <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-auto">
                                        This open-source quickstart makes it easy to deploy scalable and secure A2A and MCP services
                                        on popular cloud providers such as AWS.
                                    </p>
                                    <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-auto">
                                        Quickstart examples support global creation and discovery of entities (e.g. people, businesses, governments), decentralized
                                        authentication of their AI agents, and secure transactions in the Agentic Economy.
                                    </p>
                                    <div className="mt-5 sm:mt-8 flex justify-center">
                                        <div className="mt-3 sm:mt-0">
                                            <Button
                                                onClick={scrollToFeatures}
                                                variant="secondary"
                                                size="lg"
                                                className="w-full"
                                            >
                                                Learn More
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="py-12 bg-white dark:bg-gray-800 w-full max-w-full">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <p className="mt-4 max-w-4xl text-xl text-gray-500 dark:text-gray-300 mx-auto">
                                <b className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">The Agentic Economy will flourish</b> when an agent built in one orchestration framework can discover,
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
                    <div className="mx-auto max-w-7xl text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            <span className="block">Ready to get started?</span>
                            <span className="block">Interact with our example agents and MCP services.</span>
                        </h2>
                        <div className="mt-8 flex flex-row gap-4 justify-center">
                            <Link
                                to="/agents"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-gray-50 transition-colors duration-200"
                            >
                                Agent Demos
                            </Link>
                            <Link
                                to="/mcp"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-gray-50 transition-colors duration-200"
                            >
                                MCP Demos
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <footer className="bg-gray-900 dark:bg-black w-full max-w-full pb-20 lg:pb-12">
                    <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Company Info */}
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-xl font-bold text-white">
                                        Agent World Congress
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm leading-6 max-w-md">
                                    Connecting agent builders with technology providers, cloud services, talent,
                                    and capital partners to create the next 80 billion agents in 18 months.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                                    Quick Links
                                </h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link to="https://agentworldcongress.org/" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                            Agent World Congress
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="https://universalauth.org/" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                            Universal Authentication
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="https://agenticprofile.ai/" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                            Agentic Profile Blog
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Legal Links */}
                            <div>
                                <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                                    Legal
                                </h3>
                                <ul className="space-y-3">
                                    <li>
                                        <Link to="https://agentworldcongress.org/about/" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                            About Us
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/privacy" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/terms" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                            Terms of Service
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="https://agentworldcongress.org/contact/" className="text-gray-300 hover:text-white text-sm transition-colors duration-200">
                                            Contact
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom Footer */}
                        <div className="mt-8 pt-8 border-t border-gray-800">
                            <div className="flex flex-col md:flex-row justify-between items-center">
                                <div className="text-gray-400 text-sm">
                                    © 2025 Agent World Congress. All rights reserved.
                                </div>
                                <div className="mt-4 md:mt-0 flex space-x-6">
                                    <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors duration-200">
                                        <span className="sr-only">GitHub</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors duration-200">
                                        <span className="sr-only">Twitter</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </a>
                                    <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors duration-200">
                                        <span className="sr-only">LinkedIn</span>
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </>
    );
};

export default HomePage;
