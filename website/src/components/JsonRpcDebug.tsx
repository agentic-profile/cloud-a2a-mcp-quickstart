import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Spinner, LabelValue, LabelJson } from './index';
import { parseChallengeFromWwwAuthenticate, signChallenge } from '@agentic-profile/auth';
import { useUserProfileStore, type UserProfile } from '@/stores';
import { deleteAuthToken, useAuthToken } from '@/tools/AuthTokenManager';
import { JwtDetails } from './JwtDetails';
import { type VerificationMethod } from 'did-resolver';
import { type AgentService } from '@agentic-profile/common/schema';
import { type AgenticProfile, type JWKSet } from '@agentic-profile/common/schema';

interface Result {
    fetchResponse: Response | undefined;
    text: string | undefined;
    data: any | undefined;
    error: unknown;
}

export interface HttpStep {
    kind: 'request' | 'response';
    summary: string;
}

export interface HttpProgress {
    steps: HttpStep[];
    result?: Result
}

export interface HttpRequest {
    requestInit: RequestInit;
    onProgress?: (progress: HttpProgress) => void;
}

interface JsonRpcDebugProps {
    url: string | undefined;
    httpRequest: HttpRequest | null;
    onClose?: () => void;
    onClear?: () => void;
    className?: string;
}

export interface JsonRpcRequest {
    jsonrpc: '2.0';
    id: string;
    method: string;
    params?: any;
}

export interface JsonRpcResponse {
    jsonrpc: '2.0';
    id: string | number;
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
}

export const JsonRpcDebug = ({ 
    url, 
    httpRequest,
    onClose,
    onClear,
    className = '' 
}: JsonRpcDebugProps) => {
    const [spinner, setSpinner] = useState(false);
    const { userProfile, userAgentDid, verificationId } = useUserProfileStore();
    const [requestInit, setRequestInit] = useState<RequestInit | null>(null);
    const [method, setMethod] = useState<string | null>(null);
    const [result, setResult] = useState<Result | null>(null);

    // Extract request from httpRequest
    const request = httpRequest?.requestInit || null;

    const [retrySpinner, setRetrySpinner] = useState(false);
    const [retryInit, setRetryInit] = useState<RequestInit | null>(null);
    const [retryResult, setRetryResult] = useState<Result | null>(null);
    const { authToken, setAuthToken, clearAuthToken } = useAuthToken(url);

    // Clear all internal state
    const clearAllState = () => {
        setRequestInit(null);
        setMethod(null);
        setResult(null);
        setRetryInit(null);
        setRetryResult(null);
        setRetrySpinner(false);
        setSpinner(false);
        if (onClear) {
            onClear();
        }
    };

    const handleSendRequest = async (request: RequestInit) => {
        if( !url )
            return;

        setRetryInit(null);
        setRetrySpinner(false);
        setRetryResult(null);

        //let authToken = await getAuthToken(url);
        const result = await doFetch({ url, request, setMethod, setRequestInit, setSpinner, setResult, authToken });

        // Need to retry with auth?
        if( userProfile && result.fetchResponse && result.fetchResponse.status === 401 ) {
            if( authToken )
                deleteAuthToken(url); // authToken failed, so forget it

            const { headers } = result.fetchResponse;
            const { challenge } = parseChallengeFromWwwAuthenticate( headers?.get('WWW-Authenticate'), url );
            
            if (!userAgentDid || !verificationId) {
                throw new Error('User agent DID and verification ID are required for authentication');
            }
            const { attestation, privateJwk } = resolveAttestationAndPrivateKey( userProfile, userAgentDid, verificationId );
            const newAuthToken = await signChallenge({
                challenge,
                attestation,
                privateJwk
            });
        
            // 2nd try with auth new token - may throw an Error on response != ok
            const retryResult = await doFetch({
                url, 
                request, 
                setRequestInit: setRetryInit, 
                setSpinner: setRetrySpinner,
                setResult: setRetryResult,
                authToken: newAuthToken
            });
            
            if( retryResult.fetchResponse && retryResult.fetchResponse.ok )
                setAuthToken(newAuthToken);

            httpRequest?.onProgress?.({ steps: [], result: retryResult });
        } else {
            httpRequest?.onProgress?.({ steps: [], result });
        }
    };

    // Automatically send request when request prop changes
    useEffect(() => {
        if (request && url) {
            handleSendRequest(request);
        }
    }, [request]);

    return (
        <Card className={className}>
            <CardHeader onClose={onClose} onClear={clearAllState}>
                <h2>JSON RPC Debug</h2>
            </CardHeader>
            <CardBody className="space-y-4">
                <div>
                    <LabelValue label="URL" value={url} />
                    <LabelValue label="RPC Method" value={method ?? 'unknown'} />
                    <JwtDetails jwt={authToken} onClear={() => clearAuthToken()} />
                </div>

                {/* Initial Request */}
                <RequestCard title="First HTTP Request" request={request} requestInit={requestInit} />
                {spinner && <Spinner size="md" color="primary" />}                   
                <ResponseCard result={result} />

                {/* Retry Request with authentication */}
                <RequestCard title="Second HTTP Request with auth" request={retryInit} requestInit={retryInit} />
                {retrySpinner && <Spinner size="md" color="primary" />}                   
                <ResponseCard result={retryResult} />
            </CardBody>
        </Card>
    );
};

interface DoFetchProps {
    url: string;
    request: RequestInit;
    setMethod?: (method: string) => void;
    setRequestInit: (requestInit: RequestInit) => void;
    setSpinner: (spinner: boolean) => void;
    setResult: (result: Result) => void;
    authToken?: string | null;
}

async function doFetch({ url, request, setMethod, setRequestInit, setSpinner, setResult, authToken }:DoFetchProps) {
    let fetchResponse, text, data, error;
    try {
        const { body, headers, ...etc } = request;

        if( typeof body !== 'string')
            throw new Error('Body must be a string');

        const bodyData = {
            jsonrpc: '2.0',
            id: Date.now().toString(),
            ...JSON.parse(body)
        }
        setMethod?.(bodyData.method);

        const jsonBody = JSON.stringify(bodyData,null,4);

        const requestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
                ...(authToken ? { 'Authorization': 'Agentic ' + authToken } : {}),
            },
            body: jsonBody,
            ...etc
        };
        setRequestInit(requestInit);
        setSpinner(true);
        fetchResponse = await fetch(url, requestInit);

        // Always try to get response text/data for success result or error details
        text = await fetchResponse.text();
        if (text) {
            data = JSON.parse(text);
        }
    } catch (err) {
        error = err;
    } finally {
        setSpinner(false);
    }

    const result: Result = { fetchResponse, text, data, error };
    setResult(result);

    return result;
}

function resolveAttestationAndPrivateKey( userProfile: UserProfile, agentDid: string, verificationId: string ) {

    const { profile, keyring } = userProfile;
    const attestation = {
        agentDid, 
        verificationId
    };

    const b64uPublicKey = findPublicKey( profile, agentDid, verificationId );
    const keyset = keyring.find((keyset: JWKSet) => keyset.b64uPublicKey === b64uPublicKey);
    if( !keyset )
        throw new Error('Keyset not found for verificationId: ' + verificationId);

    return { attestation, privateJwk: keyset.privateJwk };
}

function findPublicKey( profile: AgenticProfile, agentDid: string, verificationId: string ) {
    // make sure verificationId is relative, or the did matches the profile.id
    if( verificationId.charAt(0) !== '#' ) {
        const [did,fragment] = verificationId.split('#');
        if( did !== profile.id )
            throw new Error('VerificationId refers to another profile: ' + verificationId);
        verificationId = '#' +fragment;
    }

    if( agentDid === profile.id ) {
        // naked DID, go straight to verificationMethods
        return findVerificationMethodPublicKey( profile.verificationMethod, verificationId );
    } else {
        // an agent, first verify did is correct
        let [did,fragment] = agentDid.split('#');
        if( did !== profile.id )
            throw new Error('agentDid refers to another profile: ' + agentDid);
        fragment = '#' + fragment;  // normalize

        // find service by fragment
        const agent = profile.service?.find(service => service.id === fragment) as AgentService;
        if( !agent )
            throw new Error('Agent not found: ' + agentDid);

        return findVerificationMethodPublicKey( agent.capabilityInvocation, verificationId, profile.verificationMethod );
    }
}

function findVerificationMethodPublicKey( methods: (string | VerificationMethod)[] | undefined, verificationId: string, fallbackMethods: (string | VerificationMethod)[] | undefined = undefined) {
    const found = methods?.find((method: string | VerificationMethod ) => {
        if( typeof method === 'string' )
            return method === verificationId;
        else
            return method.id === verificationId;
    });

    if( !found )
        throw new Error('VerificationMethod not found: ' + verificationId);
    
    if( typeof found === 'string' ) {
        if( fallbackMethods )
            return findVerificationMethodPublicKey( fallbackMethods, verificationId ); // look in the entity level verificationMethods
        else
            throw new Error('VerificationId found, but not resolvable: ' + verificationId);
    }

    const method = found as VerificationMethod;
    if( method.type !== 'JsonWebKey2020' )
        throw new Error('VerificationMethod is not a JsonWebKey2020: ' + verificationId);

    const b64uPublicKey = method.publicKeyJwk?.x;
    if( !b64uPublicKey )
        throw new Error('VerificationMethod has no public key: ' + verificationId);

    return b64uPublicKey;
}

// RequestCard component
const RequestCard = ({
    title,
    request, 
    requestInit 
}: { 
    title: string;
    request: RequestInit | null; 
    requestInit: RequestInit | null; 
}) => {

    if (!request) return null;

    const body = parseJson(requestInit?.body);
    const headers = formatHeaders(requestInit?.headers || {});
    
    // Check for JWT in Authorization header
    const authHeader = (headers['Authorization'] || headers['authorization'])?.split(/\s+/)?.[1];
    const jwtData = authHeader && isJWT(authHeader) ? decodeJWT(authHeader) : null;

    return (
        <Card variant="primary">
            <CardBody>
                <strong className="mb-2">{title}</strong>

                {/* Request Headers */}
                {requestInit?.headers && (
                    <LabelJson
                        label="Request Headers"
                        data={headers}
                        className="mb-3"
                        preClassName="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm overflow-x-auto border border-blue-200 dark:border-blue-700"
                    />
                )}

                {jwtData && (
                    <LabelJson
                        label="Authorization Payload"
                        data={jwtData.payload}
                        className="mb-3"
                        preClassName="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-sm overflow-x-auto border border-green-200 dark:border-green-700"
                    />
                )}

                {/* Request Body */}
                <LabelJson 
                    label="Request Body" 
                    data={body}
                />
            </CardBody>
        </Card>
    );
};

// ResponseCard component
const ResponseCard = ({ result }: { result: Result | null }) => {

    if (!result) return null;

    return (
        <Card
            variant={result.error || (result.fetchResponse && !result.fetchResponse.ok) ? 'error' : 'success'}
        >
            <CardBody>
                {result.fetchResponse && (
                    <div className="mb-3 space-y-4">
                        <LabelValue label="HTTP Response" value={`${result.fetchResponse.status} ${result.fetchResponse.statusText}`} />
                        <LabelJson label="Response Headers" data={(() => {
                            return formatHeaders(result.fetchResponse.headers);
                        })()} />
                    </div>
                )}

                <div className="mb-3">
                    <LabelJson 
                        label="Response Body" 
                        data={result.data ? result.data : (result.text || 'No response body')}
                    />
                </div>

                {/* Error Details */}
                {result.error && (
                    <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-md">
                        <div className="text-red-800 dark:text-red-200 font-medium">
                            Error: {String(result.error)}
                        </div>
                    </div>
                )}

                {/* Raw Response Text */}
                {!result.data && result.text && (
                    <div className="mt-3">
                        <h4>
                            Raw Response Text:
                        </h4>
                        <pre className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md text-xs overflow-x-auto border border-gray-200 dark:border-gray-700">
                            {result.text}
                        </pre>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

//
// Utility functions
//

function parseJson(body: any) {
    if (typeof body === 'string') {
        try {
            return JSON.parse(body);
        } catch (error) {
            return body;
        }
    }
    return body;
}

// JWT decoding utility function
function decodeJWT(token: string): { header: any; payload: any; signature: string } | null {
    try {
        // Remove Bearer prefix if present
        const cleanToken = token.replace(/^Bearer\s+/i, '');
        
        // Split JWT into parts
        const parts = cleanToken.split('.');
        if (parts.length !== 3) {
            return null;
        }
        
        // Decode header and payload (base64url decode)
        const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        const signature = parts[2];
        
        return { header, payload, signature };
    } catch (error) {
        return null;
    }
}

// Check if a string appears to be a JWT token
function isJWT(token: string): boolean {
    try {
        // Remove Bearer prefix if present
        const cleanToken = token.replace(/^Bearer\s+/i, '');
        
        // Check if it has 3 parts separated by dots
        const parts = cleanToken.split('.');
        if (parts.length !== 3) {
            return false;
        }
        
        // Try to decode the header to see if it's valid base64url
        try {
            const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
            // Check if header has typical JWT fields
            return header && (header.typ === 'JWT' || header.alg);
        } catch {
            return false;
        }
    } catch {
        return false;
    }
}

// Shared utility function to format headers
const formatHeaders = (headers: HeadersInit): Record<string, string> => {
    if (headers instanceof Headers) {
        const result: Record<string, string> = {};
        // Use entries() method to get all headers
        try {
            for (const [key, value] of headers.entries()) {
                result[key] = value;
            }
        } catch (error) {
            console.log('formatHeaders entries() failed, using fallback:', error);
            // Fallback: try to get headers one by one for CORS-restricted headers
            // Note: Browsers restrict access to certain CORS headers for security reasons
            const accessibleHeaders = [
                'content-type', 
                'content-length', 
                'cache-control', 
                'expires', 
                'last-modified', 
                'etag', 
                'date', 
                'server',
                'www-authenticate', // This should be accessible if exposed
                'WWW-Authenticate'  // Try both cases due to potential server/browser differences
            ];
            
            for (const headerName of accessibleHeaders) {
                try {
                    const value = headers.get(headerName);
                    if (value !== null) {
                        result[headerName] = value;
                    }
                } catch (e) {
                    // Skip headers that can't be accessed due to CORS restrictions
                    console.warn(`Cannot access header ${headerName} due to CORS restrictions:`, e);
                }
            }
            
            // Add a note about CORS restrictions
            result['_cors_note'] = 'Some CORS headers are restricted by browser security policy';
        }
        return result;
    }
    if (Array.isArray(headers)) {
        return Object.fromEntries(headers);
    }
    return headers as Record<string, string>;
};
