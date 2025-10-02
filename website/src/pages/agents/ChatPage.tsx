import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { Page, Button, EditableUri, JsonRpcDebug, Switch, Card, CardHeader, CardBody, HttpProgressSummary, LabelValue, LabelDid, Spinner } from '@/components';
//import { resolveRpcUrlFromWindow, updateWindowRpcUrl } from '@/tools/net';
import type { HttpProgress } from '@/components/JsonRpcDebug';
import { useUserProfileStore } from '@/stores';
import { webDidToUrl } from "@agentic-profile/common";
import { parseDid } from '@/tools/misc';
import { validateDidWebUri } from '@/tools/net';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
}

export const ChatPage = () => {
    const navigate = useNavigate();
    const { userAgentDid, verificationId } = useUserProfileStore();
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);
    const [messages, setMessages] = useState<Message[]>([]);
    /*    {
            id: '1',
            text: 'Hello! I\'m your decentralized agent. How can I help you today?',
            sender: 'agent',
            timestamp: new Date()
        }
    ]);*/
    const [inputText, setInputText] = useState('');
    const [currentRequest, setCurrentRequest] = useState<RequestInit | null>(null);
    const [showJsonRpcDebug, setShowJsonRpcDebug] = useState(false);

    //const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [agentDidError, setAgentDidError] = useState<string | null>(null);
    const [sendMessageError, setSendMessageError] = useState<string | null>(null);

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [ loadingProfile, setLoadingProfile] = useState(false);

    //const rpcUrl = resolveRpcUrlFromWindow();
    const [toAgentDid, setToAgentDid] = useState<string>('');
    const [a2aUrl, setA2aUrl] = useState<string>('');

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        const scrollToBottom = () => {
            if (messagesContainerRef.current) {
                // Try multiple approaches to find and scroll the right element
                const element = messagesContainerRef.current;
                
                // Method 1: Try scrolling the ref element directly
                element.scrollTop = element.scrollHeight;
                
                // Method 2: Try finding a child element with overflow
                const scrollableChild = element.querySelector('[class*="overflow"]') as HTMLElement;
                if (scrollableChild) {
                    scrollableChild.scrollTop = scrollableChild.scrollHeight;
                }
                
                // Method 3: Try scrolling the first child div
                const firstChild = element.firstElementChild as HTMLElement;
                if (firstChild && firstChild.scrollHeight > firstChild.clientHeight) {
                    firstChild.scrollTop = firstChild.scrollHeight;
                }
            }
        };
        
        // Immediate scroll
        requestAnimationFrame(scrollToBottom);
        
        // Additional scroll after CSS transitions complete
        setTimeout(() => {
            requestAnimationFrame(scrollToBottom);
        }, 350);
        
        // Final scroll after a longer delay
        setTimeout(() => {
            requestAnimationFrame(scrollToBottom);
        }, 500);
    }, [messages]);

    const handleToAgentDidUpdate = async (agentDid: string) => {
        setToAgentDid(agentDid);

        setLoadingProfile(true);
        setAgentDidError(null);
        try {
            const url = webDidToUrl(agentDid);
            const response = await fetch(url);
            if( !response.ok ) {
                setAgentDidError(`Error fetching agent data for ${agentDid}: ${response.statusText}`);
                return;
            }
            
            const { fragment } = parseDid(agentDid);
            const serviceId = "#" + fragment;
            const profile = await response.json();
            const service = profile.service?.find((service: any) => service.id === serviceId);
            if( !service ) {
                setAgentDidError(`Service not found for ${agentDid}: ${serviceId}`);
            } else if( service.type.toLowerCase().startsWith("a2a/") !== true) {
                setAgentDidError(`Service is not an A2A service for ${agentDid}: ${serviceId}`);
            } else if( !service.serviceEndpoint ) {
                setAgentDidError(`Service endpoint not found for ${agentDid}: ${serviceId}`);
            } else { 
                setA2aUrl(service.serviceEndpoint);
            }
        } catch (error) {
            console.error('Error fetching agent data:', error);
        } finally {
            setLoadingProfile(false);
        }
    };

    /*
    const handleUrlUpdate = (newUrl: string) => {
        updateWindowRpcUrl(newUrl);
    };*/

    const handleSendMessage = () => {
        const text = inputText.trim();
        if ( !text )
            return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: 'user',
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, newMessage]);
        
        // Clear any previous error messages
        setSendMessageError(null);
        
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
                                text
                            }
                        ]
                    },
                    metadata: {
                        envelope: {
                            toDid: toAgentDid
                        }
                    }
                }
            })
        };
        
        setCurrentRequest(rpcRequest);
        setShowJsonRpcDebug(true);
        setInputText('');
    };

    const handleJsonRpcResult = (result: any) => {
        const { kind, parts} = result.data.result;
        if ( parts ) {
            if( kind !== "message" ) {
                setSendMessageError(`Unknown A2A response kind: ${kind}`);
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
            setSendMessageError(`JSON-RPC Error: ${result.data.error.message || 'Unknown error occurred'}`);
        } else if (result.error) {
            // Handle network or other errors
            setSendMessageError(`Connection Error: ${String(result.error)}`);
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
            <div className="space-y-6">
                {/* Agent URL Display */}
                <Card>
                    <CardBody>
                        <p>To:</p>
                        <div className="ml-6">
                            <EditableUri
                                card={false}
                                label="Agent DID"
                                value={toAgentDid}
                                placeholder="Enter peer agent DID including fragment"
                                validateUri={validateDidWebUri}
                                onUpdate={handleToAgentDidUpdate}
                            />
                            { loadingProfile && <Spinner /> }
                            { agentDidError && <ErrorMessage message={agentDidError} /> }
                            <EditableUri
                                card={false}
                                label="A2A Service Endpoint"
                                value={a2aUrl}
                                placeholder="Enter peer agent DID including fragment"
                                onUpdate={setA2aUrl}
                            />
                        </div>

                        <p>From:</p>
                        <div className="flex ml-6 justify-between items-start">
                            <div className="flex-1">
                                <LabelDid label="DID" did={userAgentDid ?? ''} />
                                <LabelValue label="Verification ID" value={verificationId ?? ''} />
                            </div>
                            <Button variant="secondary" onClick={() => navigate('/identity')}>Manage Identity</Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Messages Container */}
                <Card 
                    ref={messagesContainerRef} 
                    className={`overflow-y-auto mb-6 transition-all duration-300 ease-in-out ${
                        messages.length <= 1 
                            ? 'h-32' // Collapsed height for 1 or fewer messages
                            : messages.length <= 3 
                                ? 'h-64' // Medium height for 2-3 messages
                                : 'h-96 sm:h-[500px]' // Full height for 4+ messages
                    }`}
                >
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
                                disabled={!inputText.trim()}
                                variant="primary"
                            >
                                <PaperAirplaneIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Send</span>
                            </Button>
                        </div>
                        { sendMessageError && <ErrorMessage message={sendMessageError} /> }

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

                        <HttpProgressSummary progress={httpProgress} />
                    </CardBody>
                </Card>

                {/* JSON-RPC Debug Card */}
                <JsonRpcDebug
                    httpRequest={currentRequest ? {
                        url: a2aUrl,
                        requestInit: currentRequest,
                        onProgress: (progress) => {
                            if( progress.result )
                                handleJsonRpcResult(progress.result)
                            setHttpProgress(progress)
                        }
                    } : null}
                    onClose={() => {
                        setShowJsonRpcDebug(false);
                        setCurrentRequest(null);
                    }}
                />
            </div>
        </Page>
    );
};

function ErrorMessage({ message }: { message: string }) {
    return (
        <p className="sm font-semibold !text-red-600 ml-4 mb-4">
            Error: {message}
        </p>
    );
}
