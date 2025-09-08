import { useState, useEffect, useRef } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { Page, Button, EditableUrl, JsonRpcDebug, Switch, Card, CardHeader, CardBody } from '@/components';
import { resolveRpcUrlFromWindow, updateWindowRpcUrl } from '@/tools/misc';

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
    const [currentRequest, setCurrentRequest] = useState<RequestInit | null>(null);
    const [showJsonRpcDebug, setShowJsonRpcDebug] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const rpcUrl = resolveRpcUrlFromWindow();

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleUrlUpdate = (newUrl: string) => {
        updateWindowRpcUrl(newUrl);
    };

    const handleSendMessage = () => {
        if (inputText.trim() && rpcUrl) {
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
        const { kind, parts} = result.data.result;
        if ( parts ) {
            if( kind !== "message" ) {
                setErrorMessage(`Unknown A2A response kind: ${kind}`);
                return
            }

            const text = parts
                .filter((part: any) => part.kind === "text")
                .map((part: any) => part.text)
                .join('\n\n');

            const message: Message = {
                id: Date.now().toString(),
                text,
                sender: 'agent',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, message]);
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
                value={rpcUrl}
                placeholder="Enter agent URL (e.g., /api/agents/venture or full URL)"
                onUpdate={handleUrlUpdate}
            />

            {/* Messages Container */}
            <Card ref={messagesContainerRef} className="h-96 sm:h-[500px] overflow-y-auto mb-6">
                <CardBody>
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
                </CardBody>
            </Card>

            {/* Input Area */}
            <Card>
                <CardBody>
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
                            disabled={!inputText.trim() || !rpcUrl}
                            variant="primary"
                            title={!rpcUrl ? "Please set an agent URL first" : ""}
                        >
                            <PaperAirplaneIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">Send</span>
                        </Button>
                    </div>
                    
                    {/* Debug Toggle */}
                    <div className="flex items-center space-x-3 mt-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Show JSON RPC Debug</span>
                        <Switch
                            isSelected={showJsonRpcDebug}
                            onValueChange={setShowJsonRpcDebug}
                            color="primary"
                            size="md"
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Error Message Card */}
            {errorMessage && (
                <Card variant="error" className="mt-6">
                    <CardHeader onClose={() => setErrorMessage(null)}>
                        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                            Error
                        </h3>
                    </CardHeader>
                    <CardBody>
                        <p className="text-red-800 dark:text-red-200 text-sm">
                            {errorMessage}
                        </p>
                    </CardBody>
                </Card>
            )}

            {/* JSON-RPC Debug Card */}
            {showJsonRpcDebug && rpcUrl && (
                <div className="mt-6">
                    <JsonRpcDebug
                        url={rpcUrl}
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
