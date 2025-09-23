import { McpToolCallCard } from '@/components';
import { TrashIcon } from '@heroicons/react/24/outline';
import { type HttpRequest } from '@/components/JsonRpcDebug';

interface DeleteWalletItemProps {
    walletItemKey: string;
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const DeleteWalletItem = ({ walletItemKey, onSubmitHttpRequest }: DeleteWalletItemProps) => {
    const createMcpRequest = () => {
        if (!walletItemKey.trim()) {
            alert('Please set a wallet key in the Wallet Item Key card above');
            return;
        }

        if (!confirm(`Are you sure you want to delete wallet item "${walletItemKey}"?`)) {
            return;
        }

        return {
            method: "tools/call",
            params: {
                name: "delete",
                key: walletItemKey
            }
        };
    };

    return (
        <McpToolCallCard
            title="Delete Wallet Item"
            icon={<TrashIcon className="w-5 h-5 text-white" />}
            description="Permanently delete the wallet item with the current key."
            buttonText="Delete Wallet Item"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        >
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">
                    <strong>Will delete key:</strong> <span className="font-mono">{walletItemKey}</span>
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">This key is managed by the Wallet Item Key card above</p>
            </div>
        </McpToolCallCard>
    );
};

export default DeleteWalletItem;
