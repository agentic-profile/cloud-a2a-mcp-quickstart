import { useState, useEffect } from 'react';
import { McpToolCallCard, EditableValue } from '@/components';
import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { type HttpRequest } from '@/components/JsonRpcDebug';
import { useUserProfileStore } from '@/stores/userProfileStore';

interface PresentWalletItemProps {
    walletItemKey: string;
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const PresentWalletItem = ({ walletItemKey, onSubmitHttpRequest }: PresentWalletItemProps) => {
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

    const createMcpRequest = () => {
        return {
            method: "tools/call",
            params: {
                name: "present",
                subjectDid,
                key
            }
        };
    };

    return (
        <McpToolCallCard
            title="Present Credential"
            icon={<PresentationChartLineIcon className="w-5 h-5 text-white" />}
            description="Present another users credential as a verifiable presentation with metadata."
            buttonText="Present Credential"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        >
            <EditableValue
                card={false}
                label="Subject DID"
                value={subjectDid}
                placeholder="Enter subject DID"
                onUpdate={setSubjectDid}
            />
            <EditableValue
                card={false}
                label="Key"
                value={key}
                placeholder="Enter key"
                onUpdate={setKey}
            />
        </McpToolCallCard>
    );
};

export default PresentWalletItem;
