import { McpToolCallCard } from '@/components';
import { EyeIcon } from '@heroicons/react/24/outline';
import { type HttpRequest } from '@/components/JsonRpcDebug';

interface ReadWalletItemProps {
    walletItemKey: string;
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const ReadWalletItem = ({ walletItemKey, onSubmitHttpRequest }: ReadWalletItemProps) => {
    const createMcpRequest = () => ({
        method: "tools/call",
        params: {
            name: "read",
            key: walletItemKey
        }
    });

    return (
        <McpToolCallCard
            title="Read Wallet Item"
            icon={<EyeIcon className="w-5 h-5 text-white" />}
            description="Read the wallet item using the key from the update form above."
            buttonText="Read Wallet Item"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        />
    );
};

export default ReadWalletItem;
