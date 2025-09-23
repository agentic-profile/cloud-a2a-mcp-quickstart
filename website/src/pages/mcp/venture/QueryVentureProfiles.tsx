import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import McpToolCallCard from '@/components/McpToolCallCard';

interface QueryVentureProfilesProps {
    onSubmitHttpRequest: (request: any) => void;
}

const QueryVentureProfiles = ({ onSubmitHttpRequest }: QueryVentureProfilesProps) => {
    const createMcpRequest = () => {
        return {
            method: 'tools/call',
            params: {
                name: 'recent-updates',
                arguments: { since: new Date().toISOString() }
            }
        };
    };

    return (
        <McpToolCallCard
            title="Query Venture Profiles"
            icon={<MagnifyingGlassIcon className="w-5 h-5 text-white" />}
            description="Click the button below to query the current ventures."
            buttonText="Query Ventures"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        />
    );
};

export default QueryVentureProfiles;
