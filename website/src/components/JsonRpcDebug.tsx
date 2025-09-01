import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Spinner, LabelValue, LabelJson } from './index';
import { parseChallengeFromWwwAuthenticate, signChallenge } from '@agentic-profile/auth';
import { useUserProfileStore, type UserProfile } from '@/stores';

interface Result {
    fetchResponse: Response | undefined;
    text: string | undefined;
    data: any | undefined;
    error: unknown;
}

interface JsonRpcDebugProps {
    url: string;
    request: RequestInit | null;
    onFinalResult: (result: Result) => void;
    onClose?: () => void;
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
    request, 
    onFinalResult,
    onClose,
    className = '' 
}: JsonRpcDebugProps) => {
    const [spinner, setSpinner] = useState(false);
    const { userProfile } = useUserProfileStore();
    const [requestInit, setRequestInit] = useState<RequestInit | null>(null);
    const [method, setMethod] = useState<string | null>(null);
    const [result, setResult] = useState<Result | null>(null);

    const [retrySpinner, setRetrySpinner] = useState(false);
    const [retryInit, setRetryInit] = useState<RequestInit | null>(null);
    const [retryResult, setRetryResult] = useState<Result | null>(null);

    const handleSendRequest = async (request: RequestInit) => {

        setRetryInit(null);
        setRetrySpinner(false);
        setRetryResult(null);

        const result = await doFetch({ url, request, setMethod, setRequestInit, setSpinner, setResult });

        // Need to retry with auth?
        if( userProfile && result.fetchResponse && result.fetchResponse.status === 401 ) {
            const { headers } = result.fetchResponse;

            const { challenge } = parseChallengeFromWwwAuthenticate( headers?.get('WWW-Authenticate'), url );
            
            //const authToken = await resolveAuthToken( challenge );
            const { attestation, privateJwk } = resolveAttestationAndPrivateKey( userProfile );
            const authToken = await signChallenge({
                challenge,
                attestation,
                privateJwk
            });
            console.log('authToken', authToken);
        
            // 2nd try with auth new token - may throw an Error on response != ok
            const retryResult = await doFetch({
                url, 
                request, 
                setRequestInit: setRetryInit, 
                setSpinner: setRetrySpinner,
                setResult: setRetryResult,
                authToken
            });
            onFinalResult(retryResult);
        } else {
            onFinalResult(result);
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
            <CardHeader onClose={onClose}>
                <div>
                    <h2>JSON RPC Debug</h2>
                    <LabelValue label="HTTP Request" value={url} />
                    <LabelValue label="RPC Method" value={method ?? 'unknown'} />
                </div>
            </CardHeader>
            <CardBody className="space-y-4">
                {/* Initial Request */}
                <RequestCard request={request} requestInit={requestInit} />
                {spinner && <Spinner size="md" color="primary" />}                   
                <ResponseCard result={result} />

                {/* Retry Request with authentication */}
                <RequestCard request={retryInit} requestInit={retryInit} />
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
    authToken?: string;
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

function resolveAttestationAndPrivateKey( userProfile: UserProfile ) {

    const { profile, keyring } = userProfile;
    const service = profile!.service![0];
    const firstCap = service.capabilityInvocation[0];
    const keyId = firstCap.id;

    const attestation = {
        agentDid: profile.id + service.id,
        verificationId: profile.id + keyId
    };

    const privateJwk = keyring.find(keyset => keyset.id === keyId)?.privateJwk;

    if( !privateJwk )
        throw new Error('Private key not found for keyId: ' + keyId);

    return { attestation, privateJwk };
}

// RequestCard component
const RequestCard = ({ 
    request, 
    requestInit 
}: { 
    request: RequestInit | null; 
    requestInit: RequestInit | null; 
}) => {

    if (!request) return null;

    const body = parseJson(requestInit?.body);

    return (
        <Card>
            <CardBody>
                <h4>HTTP Request</h4>

                {/* Request Headers */}
                {requestInit?.headers && (
                    <LabelJson
                        label="Request Headers"
                        data={formatHeaders(requestInit?.headers)}
                        className="mb-3"
                        preClassName="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm overflow-x-auto border border-blue-200 dark:border-blue-700"
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
        <Card>
            <CardBody>
                {result.fetchResponse && (
                    <div className="mb-3 space-y-4">
                        <LabelValue label="HTTP Response" value={`${result.fetchResponse.status} ${result.fetchResponse.statusText}`} />
                        <LabelJson label="Response Headers" data={formatHeaders(result.fetchResponse.headers)} />
                    </div>
                )}

                <div className="mb-3">
                    <LabelJson 
                        label="Response Body" 
                        data={result.data ? result.data : (result.text || 'No response body')}
                        variant={result.error || (result.fetchResponse && !result.fetchResponse.ok) ? 'failure' : 'success'}
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
                'www-authenticate' // This should be accessible if exposed
            ];
            
            for (const headerName of accessibleHeaders) {
                try {
                    const value = headers.get(headerName);
                    if (value !== null) {
                        result[headerName] = value;
                    }
                } catch (e) {
                    // Skip headers that can't be accessed due to CORS restrictions
                    console.warn(`Cannot access header ${headerName} due to CORS restrictions`);
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
