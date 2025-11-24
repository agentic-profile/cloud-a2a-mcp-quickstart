import { useState, useEffect } from 'react';
import { type HttpProgress } from '@/components/JsonRpcDebug';

export const HttpProgressSummary = ({ progress }: { progress: HttpProgress | undefined }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [copied, setCopied] = useState(false);

    // Show the component whenever progress changes
    useEffect(() => {
        if (progress) {
            setIsVisible(true);
        }
    }, [progress]);

    if (!progress || !isVisible) return null;
    
    const { steps, result } = progress;
    const preview = result?.data ? JSON.stringify(result.data, null, 2) : result?.text;
    const error = result?.error ? String(result.error) : null;

    const handleCopy = async () => {
        if (preview) {
            try {
                await navigator.clipboard.writeText(preview);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };
    
    return (
        <div className="mt-3 relative">
            {/* Close button */}
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="Close progress summary"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <ol className="space-y-1 text-sm text-gray-600 dark:text-gray-400 pr-8">
                {steps.map((step, index) => {
                    const isLastItem = index === steps.length - 1;
                    const showSpinner = step.kind === 'request' && isLastItem;
                    
                    return (
                        <li key={index} className="flex items-center">
                            <span className="mr-2 text-gray-500 dark:text-gray-400 font-mono text-xs">
                                {index + 1}.
                            </span>
                            <span className="flex-1">{step.summary}</span>
                            {showSpinner && (
                                <div className="ml-2 w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin flex-shrink-0"></div>
                            )}
                        </li>
                    );
                })}
            </ol>
            {result && <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        HTTP {result.fetchResponse?.status} {result.fetchResponse?.statusText}
                    </p>
                    <button
                        onClick={handleCopy}
                        className="px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                        aria-label="Copy to clipboard"
                    >
                        {copied ? '' : 'Copy to clipboard'}
                    </button>
                </div>
                {error && <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">{error}</p>}
                <pre 
                    className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto overflow-y-auto"
                    style={{ height: '256px', minHeight: '100px', maxHeight: '800px', resize: 'vertical' }}
                >
                    {preview}
                </pre>
            </div>}
        </div>
    );
};