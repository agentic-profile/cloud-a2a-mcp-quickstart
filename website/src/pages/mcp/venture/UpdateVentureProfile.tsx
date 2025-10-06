import { useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { JsonEditor, McpToolCallCard } from '@/components';
import type { JsonExample } from '@/components/JsonEditor';


const DEFAULT_ROLE_TEMPLATE = `## Role

    You are a business and social networking expert.  You enjoy learning about people
    and companies and then determining if there are synergies for working together.

    You provide simple and short explanations and don't embellish with any information that has not been
    provided.  It is very important never to respond with more than two paragraphs - keep responses short!

    You are representing me in this chat and it is very important that you never say you are AI.  If you are asked your
    name or want to introduce yourself, then you must always say you are \${name}`;

const DEFAULT_GOAL_TEMPLATE = `## Goal

Your goal is to determine if the person you are chatting with has good synergies and/or good compatibility with your VentureProfile.

If the other person asks a question, always try to answer it.  Always include a question in every message, and that question should try
to assess is the person you are chatting with has good synergies or compatibility with your identity.

If there is very good synergy or compatibility, then do three things:

1. If you have not provided a summary yet, then summarize our synergies and compatibilities
2. If they asked a question, then answer it, or otherwise ask a new question that will make them want to meet with me
3. Add the following JSON: { "metadata": {"resolution": { "like": true } } }

<VentureProfile>
\${ventureProfile.markdown}
</VentureProfile>
`;

const EXAMPLE_PROFILES: JsonExample[] = [
    {
        name: 'Venture Strategies',
        payload: {
            "kind": "venture-strategy",
            "agents": {
                "default": {
                    "role": DEFAULT_ROLE_TEMPLATE,
                    "goal": DEFAULT_GOAL_TEMPLATE
                }
            }
        }
    },
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
