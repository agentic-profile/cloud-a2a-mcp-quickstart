import { McpToolCallCard } from '@/components';
import { EyeIcon } from '@heroicons/react/24/outline';
import { type HttpRequest } from '@/components/JsonRpcDebug';

interface ReadReputationItemProps {
    reputationItemKey: string;
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const ReadReputationItem = ({ reputationItemKey, onSubmitHttpRequest }: ReadReputationItemProps) => {
    const createMcpRequest = () => ({
        method: "tools/call",
        params: {
            name: "read",
            key: reputationItemKey
        }
    });

    return (
        <McpToolCallCard
            title="Read One Reputation Report"
            icon={<EyeIcon className="w-5 h-5 text-white" />}
            description="Read a reputation I reported using the key from the update form above."
            buttonText="Read Reputation"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        />
    );
};

export default ReadReputationItem;
