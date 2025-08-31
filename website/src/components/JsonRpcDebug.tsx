import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Spinner, LabelValue, LabelJson } from './index';

interface Result {
    fetchResponse: Response | undefined;
    text: string | undefined;
    data: any | undefined;
    error: unknown;
}

interface JsonRpcDebugProps {
    url: string;
    request: RequestInit | null;
    onResult: (result: Result) => void;
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
    onResult,
    onClose,
    className = '' 
}: JsonRpcDebugProps) => {
    const [spinner, setSpinner] = useState(false);
    const [requestInit, setRequestInit] = useState<RequestInit | null>(null);
    const [method, setMethod] = useState<string | null>(null);
    const [result, setResult] = useState<Result | null>(null);

    const [retrySpinner, setRetrySpinner] = useState(false);
    const [retryInit, setRetryInit] = useState<RequestInit | null>(null);
    const [retryResult, setRetryResult] = useState<Result | null>(null);

    const handleSendRequest = async (request: RequestInit) => {
        setSpinner(true);
        setResult(null);

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
            setMethod(bodyData.method);

            const jsonBody = JSON.stringify(bodyData,null,4);

            const requestInit = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: jsonBody,
                ...etc
            };
            setRequestInit(requestInit);

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
        onResult(result);
    };

    // Automatically send request when request prop changes
    useEffect(() => {
        if (request && url) {
            handleSendRequest(request);
        }
    }, [request]);

    return (
        <Card className={className} onClose={onClose}>
            <CardHeader>
                <div>
                    <h2>JSON RPC Debug</h2>
                    <LabelValue label="HTTP Request" value={url} />
                    <LabelValue label="RPC Method" value={method ?? 'unknown'} />
                </div>
            </CardHeader>
            <CardBody className="space-y-4">
                {/* Initial Request */}
                <RequestCard url={url} request={request} requestInit={requestInit} />
                {spinner && <Spinner size="md" color="primary" />}                   
                <ResponseCard result={result} />

                {/* Retry Request with authentication */}
                <RequestCard url={url} request={retryInit} requestInit={retryInit} />
                {retrySpinner && <Spinner size="md" color="primary" />}                   
                <ResponseCard result={retryResult} />
            </CardBody>
        </Card>
    );
};

// RequestCard component
const RequestCard = ({ 
    url, 
    request, 
    requestInit 
}: { 
    url: string; 
    request: RequestInit | null; 
    requestInit: RequestInit | null; 
}) => {
    const formatHeaders = (headers: HeadersInit): Record<string, string> => {
        if (headers instanceof Headers) {
            const result: Record<string, string> = {};
            headers.forEach((value, key) => {
                result[key] = value;
            });
            return result;
        }
        if (Array.isArray(headers)) {
            return Object.fromEntries(headers);
        }
        return headers as Record<string, string>;
    };

    if (!request) return null;

    const body = parseJson(requestInit?.body);

    return (
        <Card>
            <CardBody>
                <LabelValue label="HTTP Request" value={url} />

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
    const formatHeaders = (headers: HeadersInit): Record<string, string> => {
        if (headers instanceof Headers) {
            const result: Record<string, string> = {};
            headers.forEach((value, key) => {
                result[key] = value;
            });
            return result;
        }
        if (Array.isArray(headers)) {
            return Object.fromEntries(headers);
        }
        return headers as Record<string, string>;
    };

    if (!result) return null;

    return (
        <Card>
            <CardBody>
                {/* HTTP Status */}
                {result.fetchResponse && (
                    <div className="mb-3 space-y-4">
                        <LabelValue label="HTTP Response" value={`${result.fetchResponse.status} ${result.fetchResponse.statusText}`} />
                        <LabelJson label="Response Headers" data={formatHeaders(result.fetchResponse.headers)} />
                    </div>
                )}

                {/* Response Body */}
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
