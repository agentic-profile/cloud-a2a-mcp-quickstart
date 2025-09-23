import { McpToolCallCard } from '@/components';
import { ListBulletIcon } from '@heroicons/react/24/outline';
import { type HttpRequest } from '@/components/JsonRpcDebug';

interface ListWalletItemsProps {
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const ListWalletItems = ({ onSubmitHttpRequest }: ListWalletItemsProps) => {
    const createMcpRequest = () => ({
        method: "tools/call",
        params: {
            name: "list"
        }
    });

    return (
        <McpToolCallCard
            title="List My Wallet Items"
            icon={<ListBulletIcon className="w-5 h-5 text-white" />}
            description="View all wallet items you own with their keys, update timestamps, and credential status."
            buttonText="List My Wallet Items"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        />
    );
};

export default ListWalletItems;
