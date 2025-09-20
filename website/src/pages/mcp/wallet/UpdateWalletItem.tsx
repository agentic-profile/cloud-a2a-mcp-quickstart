import { useState } from 'react';
import { Card, CardBody, Button } from '@/components';
import { PlusIcon } from '@heroicons/react/24/outline';

interface UpdateWalletItemProps {
    walletItemKey: string;
    onSubmitMcpRequest: (request: RequestInit) => void;
}

const UpdateWalletItem = ({ walletItemKey, onSubmitMcpRequest }: UpdateWalletItemProps) => {
    const [credentialData, setCredentialData] = useState<string>('{\n  "type": "VerifiableCredential",\n  "credentialSubject": {\n    "id": "did:example:123",\n    "name": "Example Credential"\n  }\n}');

    const handleWalletUpdate = () => {
        let parsedCredential;
        try {
            parsedCredential = JSON.parse(credentialData);
        } catch (error) {
            alert('Invalid JSON in credential data');
            return;
        }

        const mcpRequest = {
            method: "tools/call",
            params: {
                name: "update",
                item: {
                    key: walletItemKey,
                    credential: parsedCredential
                }
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
        <Card className="lg:col-span-2">
            <CardBody>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                        <PlusIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Create/Update Wallet Item</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            <strong>Using wallet key:</strong> <span className="font-mono text-blue-600 dark:text-blue-400">{walletItemKey}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">This key is managed by the Wallet Item Key card above</p>
                    </div>
                    
                    <div>
                        <label htmlFor="credentialData" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Credential Data (JSON)
                        </label>
                        <textarea
                            id="credentialData"
                            value={credentialData}
                            onChange={(e) => setCredentialData(e.target.value)}
                            rows={10}
                            placeholder='{"type": "VerifiableCredential", "credentialSubject": {...}}'
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">JSON object containing the credential data</p>
                    </div>
                    
                    <Button
                        onClick={handleWalletUpdate}
                        className="w-full"
                        color="primary"
                    >
                        Create/Update Wallet Item
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default UpdateWalletItem;
