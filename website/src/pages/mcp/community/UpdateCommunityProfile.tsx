import { useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { JsonEditor, McpToolCallCard } from '@/components';
import type { JsonExample } from '@/components/JsonEditor';
import { CHARITY_EXAMPLE, VOLUNTEER_USER_EXAMPLE, VOLUNTEER_PROFILE_EXAMPLE, EVENT_EXAMPLE } from './examples';

const EXAMPLE_PROFILES: JsonExample[] = [
    {
        name: 'Charity',
        payload: { ...CHARITY_EXAMPLE, kind: 'charity' }
    },
    {
        name: "Volunteer User",
        payload: { ...VOLUNTEER_USER_EXAMPLE, kind: 'volunteer' }
    },
    {
        name: "Volunteer Profile",
        payload: { ...VOLUNTEER_PROFILE_EXAMPLE, kind: 'volunteer' }
    },
    {
        name: "Event",
        payload: { ...EVENT_EXAMPLE, kind: 'event' }
    }
];

interface UpdateCommunityProfileProps {
    onSubmitHttpRequest: (request: any) => void;
}

const UpdateCommunityProfile = ({ onSubmitHttpRequest }: UpdateCommunityProfileProps) => {
    const [profileJson, setProfileJson] = useState('');

    const createMcpRequest = () => {
        if (!profileJson.trim()) {
            return undefined;
        }

        try {
            const profile = JSON.parse(profileJson);
            return {
                method: 'tools/call',
                params: {
                    name: 'update',
                    profile
                }
            };
        } catch (error) {
            console.error('Invalid JSON:', error);
            return undefined;
        }
    };

    return (
        <McpToolCallCard
            title="Update Community Profile"
            icon={<ArrowUpIcon className="w-5 h-5 text-white" />}
            buttonText="Update Community Profile"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        >
            <JsonEditor 
                value={profileJson}
                onChange={setProfileJson}
                placeholder="Enter your JSON RPC payload here..."
                height="h-48"
                examples={EXAMPLE_PROFILES}
            />
        </McpToolCallCard>
    );
};

export default UpdateCommunityProfile;
