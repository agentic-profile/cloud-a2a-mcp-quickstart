import { useState, useEffect } from 'react';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Page, Button, EditableUrl, JsonRpcDebug } from '@/components';
import { useSettingsStore } from '@/stores/settingsStore';

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
    const [agentUrl, setAgentUrl] = useState<string | null>(null);
    const [currentRequest, setCurrentRequest] = useState<RequestInit | null>(null);
    const [showJsonRpcDebug, setShowJsonRpcDebug] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { serverUrl } = useSettingsStore();

    useEffect(() => {
        const updateAgentUrl = () => {
            // Extract agentUrl from URL query parameters
            const urlParams = new URLSearchParams(window.location.search);
            const agentUrlParam = urlParams.get('agentUrl');
            
            // Create full URL by combining serverUrl with agentUrl
            if (agentUrlParam && serverUrl) {
                try {
                    // Remove trailing slash from serverUrl if present
                    const baseUrl = serverUrl.replace(/\/$/, '');
                    // Ensure agentUrl starts with a slash
                    const path = agentUrlParam.startsWith('/') ? agentUrlParam : `/${agentUrlParam}`;
                    const fullUrl = `${baseUrl}${path}`;
                    setAgentUrl(fullUrl);
                } catch (error) {
                    console.error('Error creating full agent URL:', error);
                    setAgentUrl(null);
                }
            } else {
                setAgentUrl(null);
            }
        };

        updateAgentUrl();
        
        // Listen for popstate events to update when URL changes
        window.addEventListener('popstate', updateAgentUrl);
        
        return () => {
            window.removeEventListener('popstate', updateAgentUrl);
        };
    }, [serverUrl]);

    const handleUrlUpdate = (newUrl: string) => {
        if (newUrl.trim()) {
            // Update the URL in browser history without page reload
            const urlParams = new URLSearchParams(window.location.search);
            
            // Extract just the path part if it's a full URL
            let pathToSave = newUrl.trim();
            try {
                const url = new URL(newUrl);
                pathToSave = url.pathname + url.search + url.hash;
            } catch {
                // If it's not a full URL, treat it as a path
                if (!pathToSave.startsWith('/')) {
                    pathToSave = `/${pathToSave}`;
                }
            }
            
            urlParams.set('agentUrl', pathToSave);
            const newUrlString = `${window.location.pathname}?${urlParams.toString()}`;
            window.history.replaceState({}, '', newUrlString);
            
            // Trigger the useEffect to update agentUrl
            const event = new PopStateEvent('popstate');
            window.dispatchEvent(event);
        }
    };


    const handleSendMessage = () => {
        if (inputText.trim() && agentUrl) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: inputText,
                sender: 'user',
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, newMessage]);
            
            // Clear any previous error messages
            setErrorMessage(null);
            
            // Create JSON-RPC request for chat message
            const rpcRequest: RequestInit = {
                body: JSON.stringify({
                    method: 'task/send',
                    params: {
                        message: {
                            role: 'user',
                            parts: [
                                {
                                    kind: 'text',
                                    text: inputText.trim()
                                }
                            ]
                        },
                        metadata: {}
                    }
                })
            };
            
            setCurrentRequest(rpcRequest);
            setShowJsonRpcDebug(true);
            setInputText('');
        }
    };

    const handleJsonRpcResult = (result: any) => {
        if (result.data && result.data.result) {
            // Handle successful JSON-RPC response
            const agentResponse: Message = {
                id: Date.now().toString(),
                text: result.data.result.message || 'Agent response received',
                sender: 'agent',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, agentResponse]);
        } else if (result.data && result.data.error) {
            // Handle JSON-RPC error
            setErrorMessage(`JSON-RPC Error: ${result.data.error.message || 'Unknown error occurred'}`);
        } else if (result.error) {
            // Handle network or other errors
            setErrorMessage(`Connection Error: ${String(result.error)}`);
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
            {/* Agent URL Display */}
            <EditableUrl
                label="Agent URL"
                value={agentUrl}
                placeholder="Enter agent URL (e.g., /api/agents/venture or full URL)"
                onUpdate={handleUrlUpdate}
            />

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
                                                ? 'bg-dodgerblue text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                }`}
                            >
                                <p className="text-sm">{message.text}</p>
                                <p                                         className={`text-xs mt-1 ${
                                            message.sender === 'user' 
                                                ? 'text-blue-200' 
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
                                                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-dodgerblue focus:border-transparent"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || !agentUrl}
                        variant="primary"
                        title={!agentUrl ? "Please set an agent URL first" : ""}
                    >
                        <PaperAirplaneIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Send</span>
                    </Button>
                </div>
            </div>

            {/* Error Message Card */}
            {errorMessage && (
                <div className="mt-6">
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl shadow-lg border-2 border-red-200 dark:border-red-800 p-4">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2 text-red-900 dark:text-red-100">
                                    Error
                                </h3>
                                <p className="text-red-800 dark:text-red-200 text-sm">
                                    {errorMessage}
                                </p>
                            </div>
                            <button
                                onClick={() => setErrorMessage(null)}
                                className="ml-4 p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                                title="Close error message"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* JSON-RPC Debug Card */}
            {showJsonRpcDebug && currentRequest && agentUrl && (
                <div className="mt-6">
                    <JsonRpcDebug
                        url={agentUrl}
                        request={currentRequest}
                        onFinalResult={handleJsonRpcResult}
                        onClose={() => {
                            setShowJsonRpcDebug(false);
                            setCurrentRequest(null);
                        }}
                    />
                </div>
            )}
        </Page>
    );
};
