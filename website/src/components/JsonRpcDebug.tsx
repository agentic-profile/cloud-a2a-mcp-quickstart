import { useEffect, useState } from 'react';
import { Card, CardBody, Spinner } from './index';

interface Result {
    fetchResponse: Response | undefined;
    text: string | undefined;
    data: any | undefined;
    error: unknown;
}

interface JsonRpcDebugProps {
    url: string;
    request: RequestInit;
    onResult: (result: Result) => void;
    className?: string;
}

interface JsonRpcRequest {
    jsonrpc: '2.0';
    id: string;
    method: string;
    params?: any;
}

interface JsonRpcResponse {
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

    const handleSendRequest = async (request: RequestInit) => {

        setSpinner(true);
        setResult(null);


        let fetchResponse, text, data, error;
        try {
            const { body, headers, ...etc } = request;

            const jsonBody = JSON.stringify({
                jsonrpc: '2.0',
                id: Date.now().toString(),
                ...(body as object)
            });

            fetchResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: jsonBody,
                ...etc
            });

            // Always try to get response text/data for success result or error details
            text = await fetchResponse.text();
            if (text) {
                data = JSON.parse(text);
            }

            /* Create detailed error object for HTTP errors
            const detailedError: RequestError = {
                message: `HTTP ${fetchResponse.status} ${fetchResponse.statusText}`,
                status: fetchResponse.status,
                statusText: fetchResponse.statusText,
                headers,
                responseText,
                responseData
            };*/
        } catch (err) {
            error = err;
        } finally {
            setSpinner(false);
        }

        const result: Result = {fetchResponse,text,data,error};
        setResult(result);
        onResult(result);
    };

    // Automatically send request when request prop changes
    useEffect(() => {
        if (request && url) {
            handleSendRequest(request);
        }
    }, [request, agentUrl]);

    const formatJson = (data: any): string => {
        try {
            return JSON.stringify(data, null, 2);
        } catch {
            return String(data);
        }
    };

    const getHttpStatusColor = (status?: number): string => {
        if (!status) return 'text-gray-600 dark:text-gray-400';
        if (status >= 200 && status < 300) return 'text-green-600 dark:text-green-400';
        if (status >= 300 && status < 400) return 'text-blue-600 dark:text-blue-400';
        if (status >= 400 && status < 500) return 'text-yellow-600 dark:text-yellow-400';
        if (status >= 500) return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {request && (
                <Card>
                    <CardBody>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                            JSON RPC Request
                        </h3>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Payload: <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{agentUrl}</code>
                        </div>
                        <pre className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm overflow-x-auto border border-blue-200 dark:border-blue-700">
                            {formatJson(request)}
                        </pre>
                    </CardBody>
                </Card>
            )}

            {/* Loading State */}
            {isLoading && (
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
            {response && (
                <Card>
                    <CardBody>
                        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                            JSON RPC Response
                        </h3>
                        <pre className={`p-3 rounded-md text-sm overflow-x-auto border ${
                            response.error 
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' 
                                : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                        }`}>
                            {formatJson(response)}
                        </pre>
                        {response.error && (
                            <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-md">
                                <div className="text-red-800 dark:text-red-200 font-medium">
                                    Error {response.error.code}: {response.error.message}
                                </div>
                                {response.error.data && (
                                    <div className="text-red-700 dark:text-red-300 text-sm mt-1">
                                        Data: {formatJson(response.error.data)}
                                    </div>
                                )}
                            </div>
                        )}
                    </CardBody>
                </Card>
            )}

            {/* Error Section */}
            {error && error instanceof RequestError && (
                <Card>
                    <CardBody>
                        <h3 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                            Request Error
                        </h3>
                        <div className="space-y-3">
                            {/* Error Message */}
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-700">
                                <p className="text-red-800 dark:text-red-200 font-medium">{error.message}</p>
                            </div>

                            {/* HTTP Status Details */}
                            {(error.status || error.statusText) && (
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        HTTP Response Details
                                    </h4>
                                    <div className="space-y-1 text-sm">
                                        {error.status && (
                                            <div className="flex items-center">
                                                <span className="text-gray-600 dark:text-gray-400 w-20">Status:</span>
                                                <span className={`font-mono ${getHttpStatusColor(error.status)}`}>
                                                    {error.status}
                                                </span>
                                            </div>
                                        )}
                                        {error.statusText && (
                                            <div className="flex items-center">
                                                <span className="text-gray-600 dark:text-gray-400 w-20">Status Text:</span>
                                                <span className="font-mono text-gray-800 dark:text-gray-200">
                                                    {error.statusText}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Response Headers */}
                            {error.headers && Object.keys(error.headers).length > 0 && (
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Response Headers
                                    </h4>
                                    <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                                        {formatJson(error.headers)}
                                    </pre>
                                </div>
                            )}

                            {/* Response Content */}
                            {(error.responseText || error.responseData) && (
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Response Content
                                    </h4>
                                    {error.responseData ? (
                                        <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                                            {formatJson(error.responseData)}
                                        </pre>
                                    ) : (
                                        <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
                                            {error.responseText}
                                        </pre>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
};
