import { useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { JsonEditor, McpToolCallCard } from '@/components';
import type { JsonExample } from '@/components/JsonEditor';


const EXAMPLE_PROFILES: JsonExample[] = [
    {
        name: 'Venture Profile',
        payload: {
            "kind": "venture",
            "name": "TechStart Inc.",
            "description": "A revolutionary AI-powered startup focused on sustainable technology solutions.",
            "company": {
                "name": "TechStart Inc.",
                "founded": "2024",
                "employees": 50,
                "location": {
                    "city": "San Francisco",
                    "state": "CA",
                    "country": "USA"
                }
            },
            "funding": {
                "stage": "Series A",
                "amount": 5000000,
                "investors": ["VC1", "VC2", "VC3"]
            },
            "technologies": ["AI", "Machine Learning", "Cloud"],
            "social": {
                "website": "https://techstart.com",
                "linkedin": "https://linkedin.com/company/techstart",
                "twitter": "@techstart"
            }
        }
    },
    {
        name: 'Capital Profile',
        payload: {
            "kind": "capital",
            "name": "Unlimited Checks",
            "description": "We will write a check for you!!",
        }
    }
];

interface UpdateVentureProfileProps {
    onSubmitHttpRequest: (request: any) => void;
}

const UpdateVentureProfile = ({ onSubmitHttpRequest }: UpdateVentureProfileProps) => {
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
                    arguments: {
                        profile
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
            title="Update Venture Profile"
            icon={<ArrowUpIcon className="w-5 h-5 text-white" />}
            buttonText="Update Venture Profile"
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

export default UpdateVentureProfile;
