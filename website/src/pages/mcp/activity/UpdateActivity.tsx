import { useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { JsonEditor, McpToolCallCard } from '@/components';
import type { JsonExample } from '@/components/JsonEditor';
import { ACTIVITY_EXAMPLE } from './examples';

const EXAMPLE_ACTIVITIES: JsonExample[] = [
    {
        name: "Activity",
        payload: { ...ACTIVITY_EXAMPLE, kind: 'activity' }
    }
];

interface UpdateActivityProps {
    onSubmitHttpRequest: (request: any) => void;
}

const UpdateActivity = ({ onSubmitHttpRequest }: UpdateActivityProps) => {
    const [activityJson, setActivityJson] = useState('');

    const createMcpRequest = () => {
        if (!activityJson.trim()) {
            return undefined;
        }

        try {
            const activity = JSON.parse(activityJson);
            return {
                method: 'tools/call',
                params: {
                    name: 'update',
                    arguments: {
                        activity
                    }
                }
            };
        } catch (error) {
            console.error('Invalid JSON:', error);
            return undefined;
        }
    };

    return (
        <McpToolCallCard
            title="Update Activity"
            icon={<ArrowUpIcon className="w-5 h-5 text-white" />}
            buttonText="Update Activity"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        >
            <JsonEditor 
                value={activityJson}
                onChange={setActivityJson}
                placeholder="Enter your JSON RPC payload here..."
                height="h-48"
                examples={EXAMPLE_ACTIVITIES}
            />
        </McpToolCallCard>
    );
};

export default UpdateActivity;
