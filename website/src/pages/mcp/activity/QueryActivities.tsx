import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import McpToolCallCard from '@/components/McpToolCallCard';
import { useEffect, useState } from 'react';
import { EditableValue } from '@/components';
import { useUserProfileStore } from '@/stores/userProfileStore';

interface QueryCommunityProfilesProps {
    onSubmitHttpRequest: (request: any) => void;
}

const QueryCommunityProfiles = ({ onSubmitHttpRequest }: QueryCommunityProfilesProps) => {
    const { userProfile } = useUserProfileStore();
    const [did, setDid] = useState<string>('');

    useEffect(() => {
        setDid(userProfile?.profile?.id ?? '');
    }, [userProfile]);
    
    const createMcpRequest = () => {
        return {
            method: 'tools/call',
            params: {
                name: 'about',
                did
            }
        };
    };

    return (
        <McpToolCallCard
            title="Query Community Profiles"
            icon={<MagnifyingGlassIcon className="w-5 h-5 text-white" />}
            description="Click the button below to query the current communities."
            buttonText="Query Communities"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        >
            <EditableValue
                card={false}
                label="DID"
                value={did}
                placeholder="Enter DID"
                onUpdate={setDid}
            />
        </McpToolCallCard>
    );
};

export default QueryCommunityProfiles;
