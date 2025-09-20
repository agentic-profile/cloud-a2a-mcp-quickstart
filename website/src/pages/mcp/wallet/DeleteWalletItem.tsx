import { Card, CardBody, Button } from '@/components';
import { TrashIcon } from '@heroicons/react/24/outline';

interface DeleteWalletItemProps {
    walletItemKey: string;
    onSubmitMcpRequest: (request: RequestInit) => void;
}

const DeleteWalletItem = ({ walletItemKey, onSubmitMcpRequest }: DeleteWalletItemProps) => {
    const handleWalletDelete = () => {
        if (!walletItemKey.trim()) {
            alert('Please set a wallet key in the Wallet Item Key card above');
            return;
        }

        if (!confirm(`Are you sure you want to delete wallet item "${walletItemKey}"?`)) {
            return;
        }

        const mcpRequest = {
            method: "tools/call",
            params: {
                name: "delete",
                key: walletItemKey
            }
        };

        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mcpRequest),
        };

        onSubmitMcpRequest(request);
    };

    return (
        <Card>
            <CardBody>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
                        <TrashIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Delete Wallet Item</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Permanently delete the wallet item with the current key.
                </p>
                
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-700 dark:text-red-300">
                        <strong>Will delete key:</strong> <span className="font-mono">{walletItemKey}</span>
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">This key is managed by the Wallet Item Key card above</p>
                </div>
                
                <Button
                    onClick={handleWalletDelete}
                    className="w-full"
                    color="danger"
                >
                    Delete Wallet Item
                </Button>
            </CardBody>
        </Card>
    );
};

export default DeleteWalletItem;
