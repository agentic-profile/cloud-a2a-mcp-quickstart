import { McpToolCallCard } from '@/components';
import { TrashIcon } from '@heroicons/react/24/outline';
import { type HttpRequest } from '@/components/JsonRpcDebug';

interface DeleteReputationItemProps {
    reputationItemKey: string;
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const DeleteReputationItem = ({ reputationItemKey, onSubmitHttpRequest }: DeleteReputationItemProps) => {
    const createMcpRequest = () => ({
        method: "tools/call",
        params: {
            name: "delete",
            key: reputationItemKey
        }
    });

    return (
        <McpToolCallCard
            title="Delete Reputation Item"
            icon={<TrashIcon className="w-5 h-5 text-white" />}
            description="Delete the reputation item using the key from the update form above."
            buttonText="Delete Reputation Item"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        />
    );
};

export default DeleteReputationItem;
