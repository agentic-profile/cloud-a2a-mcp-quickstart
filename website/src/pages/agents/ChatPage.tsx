import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PaperAirplaneIcon, ChatBubbleLeftRightIcon, StarIcon as StarOutlineIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import {
    Page,
    Button, Label,
    EditableUri, ErrorSubtext, JsonRpcDebug, Markdown, Card, CardBody,
    HttpProgressSummary, LabelValue, LabelDid, Spinner,
    Switch
} from '@/components';
import { useParamFromWindow, updateWindowParam } from '@/tools/net';
import type { HttpProgress } from '@/components/JsonRpcDebug';
import { useUserProfileStore } from '@/stores';
import { webDidToUrl } from "@agentic-profile/common";
import { parseDid } from '@/tools/misc';
import { validateDidWebUri } from '@/tools/net';

const A2A_URL_PARAM = 'a2aUrl';
const TO_AGENT_OPTIONS = [ 'did:web:iamagentic.ai:127#venture' ];
const TO_SERVICE_ENDPOINT_OPTIONS = ['http://localhost:3000/a2a/venture'];

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    metadata?: any;
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
    const [resolution, setResolution] = useState<any|undefined>({like:false});

    const [agentDidError, setAgentDidError] = useState<string | null>(null);
    const [sendMessageError, setSendMessageError] = useState<string | null>(null);

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [ loadingProfile, setLoadingProfile] = useState(false);

    const a2aUrl = useParamFromWindow(A2A_URL_PARAM);
    const [toAgentDid, setToAgentDid] = useState<string>('');
    const [doRewind, setDoRewind] = useState(false);

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
            if( !fragment ) {
                setAgentDidError(`Invalid agent DID; missing fragment`);
                return;
            }
            const serviceId = "#" + fragment;
            const profile = await response.json();
            const service = profile.service?.find((service: any) => service.id === serviceId);
            if( !service ) {
                setAgentDidError(`Agent service ${serviceId} not found for ${agentDid}`);
            } else if( service.type.toLowerCase().startsWith("a2a/") !== true) {
                setAgentDidError(`Service is not an A2A service for ${agentDid}: ${serviceId}`);
            } else if( !service.serviceEndpoint ) {
                setAgentDidError(`Service endpoint not found for ${agentDid}: ${serviceId}`);
            } else { 
                updateWindowParam(A2A_URL_PARAM, service.serviceEndpoint);
            }
        } catch (error) {
            const msg = error instanceof Error ? error.message : `Failed to fetch agent profile data ${error}`;
            setAgentDidError(msg);
        } finally {
            setLoadingProfile(false);
        }
    };

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
        
        if( doRewind ) {
            setMessages([newMessage]);
            setResolution(undefined);
        } else
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
                        ],
                        metadata: {
                            envelope: {
                                toAgentDid,
                                rewind: doRewind ? new Date(0).toISOString() : undefined
                            }
                        }
                    }
                }
            })
        };
        
        setDoRewind(false);
        setCurrentRequest(rpcRequest);
        setInputText('');
    };

    const handleJsonRpcResult = (result: any) => {
        const { kind, parts, metadata } = result?.data?.result ?? {};
        if( metadata?.resolution ) {
            setResolution(metadata.resolution);
        }
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
                timestamp: new Date(),
                metadata
            };
            setMessages(prev => [...prev, message]);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleA2aUrlUpdate = (a2aUrl: string) => {
        updateWindowParam(A2A_URL_PARAM, a2aUrl);
    };

    const sendDisabledReason = !isValidDid(toAgentDid) ? 'Invalid agent DID' : !isValidUrl(a2aUrl) ? 'Invalid A2A service endpoint' : undefined;

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
                        <p>To</p>
                        <div className="ml-6">
                            <EditableUri
                                card={false}
                                label="Agent DID"
                                value={toAgentDid}
                                placeholder="Enter peer agent DID including fragment"
                                validateUri={validateDidWebUri}
                                onUpdate={handleToAgentDidUpdate}
                                options={TO_AGENT_OPTIONS}
                            />
                            { loadingProfile && <Spinner /> }
                            { agentDidError && <ErrorSubtext message={agentDidError} /> }
                            <EditableUri
                                card={false}
                                label="A2A Service Endpoint"
                                value={a2aUrl}
                                placeholder="Enter peer agent DID including fragment"
                                onUpdate={handleA2aUrlUpdate}
                                options={TO_SERVICE_ENDPOINT_OPTIONS}
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
                <Card>
                    <CardBody>
                        <div
                            ref={messagesContainerRef} 
                            className={`overflow-y-auto mb-6 transition-all duration-300 ease-in-out ${
                                messages.length === 0
                                    ? 'h-64' // Taller height for empty state to avoid scrollbar
                                    : messages.length <= 2 
                                        ? 'h-64' // Medium height for 1-2 messages
                                        : 'h-96 sm:h-[500px]' // Full height for 3+ messages
                            }`}
                        >
                            {messages.length === 0 ? (
                                // Empty state with chat icon
                                <div className="flex flex-col items-center justify-center h-full py-12">
                                    <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400 text-lg">Start a conversation</p>
                                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Send a message below to begin chatting</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs sm:max-w-lg lg:max-w-2xl xl:max-w-4xl px-4 py-2 rounded-lg ${
                                                                                                message.sender === 'user'
                                                                ? 'bg-dodgerblue text-white'
                                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                                }`}
                                            >
                                                <Markdown>{message.text}</Markdown>
                                                <div className="flex items-center gap-2">
                                                    <p className={`text-xs mt-1 ${
                                                                message.sender === 'user' 
                                                                    ? 'text-blue-200' 
                                                                    : 'text-gray-500 dark:text-gray-400'
                                                            }`}>
                                                        {message.timestamp.toLocaleTimeString()}
                                                    </p>
                                                    {message.metadata?.resolution?.like === true && (
                                                        <StarSolidIcon className="h-4 w-4 text-yellow-500" />
                                                    )}
                                                    {message.metadata?.resolution?.like === false && (
                                                        <StarOutlineIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        { resolution && <div>
                            <div className="flex items-center justify-between">
                                <Label label="Peer resolution" />
                                <button
                                    onClick={() => setResolution(undefined)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                    aria-label="Clear resolution"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="mb-2 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700 overflow-x-auto">
                                <pre className="text-sm whitespace-pre-wrap break-words">
                                    {JSON.stringify(resolution, null, 4)}
                                </pre>
                            </div>
                        </div>}
                        <div className="flex space-x-3 mb-2">
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
                        { sendDisabledReason && <ErrorSubtext message={sendDisabledReason} /> }
                        { sendMessageError && <ErrorSubtext message={sendMessageError} /> }

                        <div className="flex items-center gap-2 justify-end">
                            <Switch
                                isSelected={doRewind}
                                onValueChange={(enabled) => setDoRewind(enabled)}
                                size="sm"
                                color="primary"
                            />
                            <span>Rewind on send</span>
                        </div>

                        <HttpProgressSummary progress={httpProgress} />
                    </CardBody>
                </Card>

                {/* JSON-RPC Debug Card */}
                <JsonRpcDebug
                    httpRequest={currentRequest ? {
                        url: a2aUrl ?? undefined,
                        requestInit: currentRequest,
                        onProgress: (progress) => {
                            if( progress.result )
                                handleJsonRpcResult(progress.result)
                            setHttpProgress(progress)
                        }
                    } : null}
                />
            </div>
        </Page>
    );
};

function isValidDid(did: string): boolean {
    return did.startsWith('did:web:');
}

function isValidUrl(url: string | null | undefined): boolean {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
