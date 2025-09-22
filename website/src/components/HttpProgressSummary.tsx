import { type HttpProgress } from '@/components/JsonRpcDebug';

export const HttpProgressSummary = ({ progress }: { progress: HttpProgress | undefined }) => {
    if (!progress) return null;
    const { steps, result } = progress;
    const preview = result?.data ? JSON.stringify(result.data, null, 2) : result?.text;
    
    return (
        <div>
            <ol className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                {steps.map((step, index) => {
                    const isLastItem = index === steps.length - 1;
                    const showSpinner = step.kind === 'request' && isLastItem;
                    
                    return (
                        <li key={step.kind} className="flex items-center">
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
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    HTTP {result.fetchResponse?.status} {result.fetchResponse?.statusText}
                </p>
                <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">{preview}</pre>
            </div>}
        </div>
    );
};