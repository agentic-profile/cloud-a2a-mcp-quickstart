import { type HttpProgress } from '@/components/JsonRpcDebug';

export const HttpProgressSummary = ({ progress }: { progress: HttpProgress | undefined }) => {
    if (!progress) return null;
    
    return (
        <div>
            <h1>Http Progress: {progress.steps.length} steps</h1>
            <ul>
                {progress.steps.map((step) => (
                    <li key={step.kind}>{step.kind}: {step.summary}</li>
                ))}
            </ul>
        </div>
    );
};