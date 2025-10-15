import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Card, CardBody } from './index';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the error to console for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        // Update state with error info
        this.setState({
            error,
            errorInfo
        });

        // Call optional error handler
        this.props.onError?.(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <Card variant="error" className="m-4">
                    <CardBody>
                        <h2 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-red-700 dark:text-red-300 mb-4">
                            An error occurred while rendering this component.
                        </p>
                        
                        {this.state.error && (
                            <details className="mt-4">
                                <summary className="cursor-pointer text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                                    Error Details
                                </summary>
                                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-700">
                                    <pre className="text-xs text-red-800 dark:text-red-200 whitespace-pre-wrap overflow-x-auto">
                                        {this.state.error.toString()}
                                    </pre>
                                    {this.state.errorInfo && (
                                        <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap overflow-x-auto mt-2">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    )}
                                </div>
                            </details>
                        )}
                        
                        <button
                            onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </CardBody>
                </Card>
            );
        }

        return this.props.children;
    }
}

// Hook version for functional components
export function useErrorHandler() {
    return (error: Error, errorInfo?: ErrorInfo) => {
        console.error('Error caught by useErrorHandler:', error, errorInfo);
        // You can add additional error reporting logic here
    };
}

