import { McpToolCallCard } from '@/components';
import { UserIcon } from '@heroicons/react/24/outline';
import { type HttpRequest } from '@/components/JsonRpcDebug';

interface ListByReporterProps {
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const ListByReporter = ({ onSubmitHttpRequest }: ListByReporterProps) => {
    const createMcpRequest = () => ({
        method: "tools/call",
        params: {
            name: "list-by-reporter"
        }
    });

    return (
        <McpToolCallCard
            title="List Reputations I Reported"
            icon={<UserIcon className="w-5 h-5 text-white" />}
            description="List all reputation items that I have reported about others."
            buttonText="List Reputations"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        />
    );
};

export default ListByReporter;
