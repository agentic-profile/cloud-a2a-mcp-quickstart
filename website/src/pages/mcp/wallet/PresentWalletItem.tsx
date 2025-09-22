import { useState, useEffect } from 'react';
import { Card, CardBody, Button, HttpProgressSummary } from '@/components';
import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { type HttpProgress, type HttpRequest } from '@/components/JsonRpcDebug';
import { useUserProfileStore } from '@/stores/userProfileStore';

interface PresentWalletItemProps {
    walletItemKey: string;
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const PresentWalletItem = ({ walletItemKey, onSubmitHttpRequest }: PresentWalletItemProps) => {
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);
    const [subjectDid, setSubjectDid] = useState<string>('');
    const [key, setKey] = useState<string>('');
    const { userProfile } = useUserProfileStore();

    // Update key whenever walletItemKey changes
    useEffect(() => {
        setKey(walletItemKey);
    }, [walletItemKey]);

    useEffect(()=>{
        if (userProfile) {
            setSubjectDid(userProfile.profile?.id);
        }
    }, [userProfile])

    const handleWalletPresent = () => {
        const mcpRequest = {
            method: "tools/call",
            params: {
                name: "present",
                subjectDid,
                key
            }
        };

        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mcpRequest),
        };

        onSubmitHttpRequest({
            requestInit: request,
            onProgress: setHttpProgress
        });
    };

    return (
        <Card>
            <CardBody>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                        <PresentationChartLineIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Present Credential</h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    Present another users credential as a verifiable presentation with metadata.
                </p>
                
                <div className="space-y-4 mb-4">
                    <div>
                        <label htmlFor="subjectDid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Subject DID
                        </label>
                        <input
                            type="text"
                            id="subjectDid"
                            value={subjectDid}
                            onChange={(e) => setSubjectDid(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Enter subject DID"
                        />
                    </div>
                    <div>
                        <label htmlFor="key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Key
                        </label>
                        <input
                            type="text"
                            id="key"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Enter key"
                        />
                    </div>
                </div>
                
                <Button
                    onClick={handleWalletPresent}
                    className="w-full"
                    color="secondary"
                >
                    Present Credential
                </Button>

                <HttpProgressSummary progress={httpProgress} />
            </CardBody>
        </Card>
    );
};

export default PresentWalletItem;
