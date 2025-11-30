import { useState } from 'react';
import { Card, CardBody, Button, HttpProgressSummary, EditableValue } from '@/components';
import { 
    DocumentTextIcon, 
    ClockIcon, 
    TrashIcon, 
    ListBulletIcon 
} from '@heroicons/react/24/outline';
import { mcpToolsCallRequestInit2, mcpMethodRequestInit } from '../util/misc';
import { type HttpProgress } from '@/components/JsonRpcDebug';
import { PlusIcon } from '@heroicons/react/24/solid';

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

const QuickActions = ({ onSubmitHttpRequest }: QuickActionsProps) => {
    const [activeAction, setActiveAction] = useState<string | null>(null);
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);
    const [did, setDid] = useState<string>('');

    const actions: ActionButton[] = [
        {
            id: 'read',
            label: 'Read Volunteer',
            icon: <DocumentTextIcon className="w-5 h-5" />,
            createRequest: ({did}) => mcpToolsCallRequestInit2("read", {did}),
        },
        {
            id: 'recent-updates',
            label: 'Recent Volunteers',
            icon: <ClockIcon className="w-5 h-5" />,
            createRequest: () => mcpToolsCallRequestInit2(
                "recent-updates",
                {}
            ),
        },
        {
            id: 'delete',
            label: 'Delete Volunteer',
            icon: <TrashIcon className="w-5 h-5" />,
            createRequest: ({did}) => mcpToolsCallRequestInit2("delete", {did}),
        },
        {
            id: 'list-tools',
            label: 'List Tools',
            icon: <ListBulletIcon className="w-5 h-5" />,
            createRequest: () => mcpMethodRequestInit("tools/list"),
        },
        {
            id: 'bulk-delete',
            label: 'Bulk Delete Volunteers',
            icon: <TrashIcon className="w-5 h-5" />,
            createRequest: () => mcpToolsCallRequestInit2("bulk-delete", {limit: 100}),
        },
        {
            id: 'bulk-create',
            label: 'Bulk Create Volunteers',
            icon: <PlusIcon className="w-5 h-5" />,
            createRequest: () => mcpToolsCallRequestInit2("bulk-create", {limit: 100}),
        }
    ];

    const handleActionClick = (action: ActionButton) => {
        setActiveAction(action.id);
        const request = action.createRequest({did});
        
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
                        <ListBulletIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Quick Actions</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Common operations for managing volunteer activities and tools.
                </p>
                
                <EditableValue
                    label="Volunteer DID"
                    value={did}
                    placeholder="Enter volunteer did"
                    onUpdate={setDid}
                    card={false}
                />
                
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

export default QuickActions;
