import { useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { JsonEditor, McpToolCallCard } from '@/components';
import type { JsonExample } from '@/components/JsonEditor';
import { VOLUNTEER_EXAMPLE } from './examples';

const EXAMPLE_VOLUNTEERS: JsonExample[] = [
    {
        name: "Volunteer",
        payload: VOLUNTEER_EXAMPLE
    }
];

interface UpdateVolunteerProps {
    onSubmitHttpRequest: (request: any) => void;
}

const UpdateVolunteer = ({ onSubmitHttpRequest }: UpdateVolunteerProps) => {
    const [volunteerJson, setVolunteerJson] = useState('');

    const createMcpRequest = () => {
        if (!volunteerJson.trim()) {
            return undefined;
        }

        try {
            const volunteer = JSON.parse(volunteerJson);
            return {
                method: 'tools/call',
                params: {
                    name: 'update',
                    arguments: {
                        volunteer
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
            title="Update Volunteer"
            icon={<ArrowUpIcon className="w-5 h-5 text-white" />}
            buttonText="Update Volunteer"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        >
            <JsonEditor 
                value={volunteerJson}
                onChange={setVolunteerJson}
                placeholder="Enter your JSON RPC payload here..."
                height="h-48"
                examples={EXAMPLE_VOLUNTEERS}
            />
        </McpToolCallCard>
    );
};

export default UpdateVolunteer;
