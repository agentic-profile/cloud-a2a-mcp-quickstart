import { useEffect, useState } from 'react';
import { Card, CardBody, Spinner, LabelValue, LabelJson } from './index';

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
    className = '' 
}: JsonRpcDebugProps) => {
    const [spinner, setSpinner] = useState(false);
    const [result, setResult] = useState<Result | null>(null);
    const [requestInit, setRequestInit] = useState<RequestInit | null>(null);

    const handleSendRequest = async (request: RequestInit) => {
        setSpinner(true);
        setResult(null);

        let fetchResponse, text, data, error;
        try {
            const { body, headers, ...etc } = request;

            if( typeof body !== 'string')
                throw new Error('Body must be a string');

            const jsonBody = JSON.stringify({
                jsonrpc: '2.0',
                id: Date.now().toString(),
                ...JSON.parse(body)
            },null,4);

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

    const getHttpStatusColor = (status?: number): string => {
        if (!status) return 'text-gray-600 dark:text-gray-400';
        if (status >= 200 && status < 300) return 'text-green-600 dark:text-green-400';
        if (status >= 300 && status < 400) return 'text-blue-600 dark:text-blue-400';
        if (status >= 400 && status < 500) return 'text-yellow-600 dark:text-yellow-400';
        if (status >= 500) return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400';
    };

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

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Request Section */}
            {request && (
                <Card>
                    <CardBody>
                        <h3>JSON RPC Request</h3>
                        <LabelValue label="URL" value={url} />

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
                            data={typeof requestInit?.body === 'string' ? requestInit.body : ''}
                            preClassName="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm overflow-x-auto border border-blue-200 dark:border-blue-700"
                        />
                    </CardBody>
                </Card>
            )}

            {/* Loading State */}
            {spinner && (
                <Card>
                    <CardBody>
                        <div className="text-center py-6">
                            <div className="inline-flex items-center">
                                <Spinner size="md" color="primary" />
                                <span className="ml-3 text-gray-600 dark:text-gray-400">Sending request...</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Response Section */}
            {result && (
                <Card>
                    <CardBody>
                        <h3>
                            JSON RPC Response
                        </h3>

                        {/* HTTP Status */}
                        {result.fetchResponse && (
                            <div className="mb-3">
                                <LabelValue label="HTTP Status" value={`${result.fetchResponse.status} ${result.fetchResponse.statusText}`} />
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
            )}
        </div>
    );
};
