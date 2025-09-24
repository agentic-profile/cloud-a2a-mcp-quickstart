import { useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { JsonEditor, McpToolCallCard } from '@/components';
import type { JsonExample } from '@/components/JsonEditor';

const EXAMPLE_PROFILES: JsonExample[] = [
    {
        name: 'Volunteer',
        payload: {
            "kind": "volunteer",
            "name": "TechStart Inc.",
            "description": "A revolutionary AI-powered startup focused on sustainable technology solutions.",
            "social": {
                "website": "https://techstart.com",
                "linkedin": "https://linkedin.com/company/techstart",
                "twitter": "@techstart"
            }
        }
    },
    {
        name: 'Charity',
        payload: {
            "kind": "charity",
            "name": "Unlimited Checks",
            "description": "We will write a check for you!!",
        }
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
