import { useState } from 'react';
import { Card, CardBody, Button, HttpProgressSummary, MultilineTextEditor, Label } from '@/components';
import { 
    DocumentTextIcon, 
    ClockIcon, 
    TrashIcon, 
    PresentationChartLineIcon 
} from '@heroicons/react/24/outline';
import { mcpToolsCallRequestInit2 } from '../util/misc';
import { type HttpProgress } from '@/components/JsonRpcDebug';

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


interface QuickActionsProps {
    onSubmitHttpRequest: (request: any) => void;
}

interface ActionButton {
    id: string;
    label: string;
    icon: React.ReactNode;
    createRequest: (params?: any) => RequestInit;
}

/*
function daysAgo(days: number) {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}*/

export default function EditVentureStrategy({ onSubmitHttpRequest }: QuickActionsProps) {
    const [activeAction, setActiveAction] = useState<string | null>(null);
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);
    const [role, setRole] = useState('');
    const [goal, setGoal] = useState('');

    const actions: ActionButton[] = [
        {
            id: 'read',
            label: 'Read Strategy',
            icon: <DocumentTextIcon className="w-5 h-5" />,
            createRequest: () => mcpToolsCallRequestInit2("read", { kind: 'venture-strategy' }),
        },
        {
            id: 'update',
            label: 'Update Strategy',
            icon: <ClockIcon className="w-5 h-5" />,
            createRequest: () => mcpToolsCallRequestInit2(
                "update",
                {
                    profile: {
                        kind: 'venture-strategy',
                        agents: {
                            default: {
                                role: role,
                                goal: goal
                            }
                        }
                    }
                }
            ),
        },
        {
            id: 'delete',
            label: 'Delete Strategy',
            icon: <TrashIcon className="w-5 h-5" />,
            createRequest: () => mcpToolsCallRequestInit2("delete", {kind: 'venture-strategy'}),
        }
    ];

    const handleActionClick = (action: ActionButton) => {
        setActiveAction(action.id);
        const request = action.createRequest();
        
        onSubmitHttpRequest({
            requestInit: request,
            onProgress: (progress: HttpProgress) => {
                if( progress.result )
                    setActiveAction(null);
                console.log('progress', progress);
                setHttpProgress(progress)
            }
        });
    };

    return (
        <Card>
            <CardBody>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <PresentationChartLineIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Venture Strategy</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Manage prompts used by the Venture Agent
                </p>

                <Label label="Role" />
                <MultilineTextEditor
                    value={role}
                    onChange={setRole}
                    placeholder="Enter your role here..."
                />

                <div className="flex justify-end my-2">
                    <Button onClick={() => setRole(DEFAULT_ROLE_TEMPLATE)}>Use Default Role</Button>
                </div>

                <Label label="Goal" />
                <MultilineTextEditor
                    value={goal}
                    onChange={setGoal}
                    placeholder="Enter your goal here..."
                />

                <div className="flex justify-end my-2">
                    <Button onClick={() => setGoal(DEFAULT_GOAL_TEMPLATE)}>Use Default Goal</Button>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {actions.map((action) => (
                        <Button
                            key={action.id}
                            onClick={() => handleActionClick(action)}
                            loading={activeAction === action.id}
                            disabled={!!activeAction}
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>

                <HttpProgressSummary progress={httpProgress} />
            </CardBody>
        </Card>
    );
};
