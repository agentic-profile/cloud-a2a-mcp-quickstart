import { useState } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import Page from '@/components/Page';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
}

export const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! I\'m your decentralized agent. How can I help you today?',
            sender: 'agent',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');

    const handleSendMessage = () => {
        if (inputText.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: inputText,
                sender: 'user',
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, newMessage]);
            setInputText('');
            
            // Simulate agent response
            setTimeout(() => {
                const agentResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: 'I received your message. This is a demo response from your decentralized agent.',
                    sender: 'agent',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, agentResponse]);
            }, 1000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <Page
            title="Chat with AI Agent"
            subtitle="Connect with your decentralized AI agent for intelligent conversations"
            maxWidth="4xl"
            padding="lg"
        >
            {/* Messages Container */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-96 sm:h-[500px] overflow-y-auto p-4 sm:p-6 mb-6">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs sm:max-w-sm lg:max-w-md px-4 py-2 rounded-lg ${
                                    message.sender === 'user'
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                }`}
                            >
                                <p className="text-sm">{message.text}</p>
                                <p className={`text-xs mt-1 ${
                                    message.sender === 'user' 
                                        ? 'text-purple-200' 
                                        : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                    {message.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex space-x-3">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message here..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim()}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg text-white transition-colors duration-200 flex items-center space-x-2"
                    >
                        <PaperAirplaneIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        About This Chat
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                        This is a demonstration of a decentralized agent chat interface. 
                        The agent can process your messages and respond intelligently using 
                        decentralized protocols and AI capabilities.
                    </p>
                </div>
            </div>
        </Page>
    );
};
