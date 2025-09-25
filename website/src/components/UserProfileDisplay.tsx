import { UserIcon } from '@heroicons/react/24/outline';
import { Button, Card, CardBody, CardHeader, LabelValue, LabelDid, RadioButton, RadioGroup } from '@/components';
import { useUserProfileStore } from '@/stores';
import { type AgentService } from '@agentic-profile/common/schema';
import { type VerificationMethod } from 'did-resolver';
import { useEffect } from 'react';
import { firstAgentKey } from '@/tools/keyring';

export const UserProfileDisplay = () => {
    const { userProfile, userAgentDid, verificationId, setUserAgentDid, clearUserProfile } = useUserProfileStore();

    if (!userProfile) {
        return null;
    }

    const { profile, keyring } = userProfile;
    const did = profile.id;

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="p-6">
                <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                        <UserIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2>Your Agentic Profile</h2>
                </div>

                <div className="space-y-4 mb-6">
                    <Card variant="default" className="p-4">
                        <CardHeader>
                            <h3>Basic Information</h3>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-2 text-sm">
                                <LabelValue 
                                    label="Name" 
                                    value={profile.name || 'Not specified'} 
                                />
                                <LabelDid 
                                    label="DID" 
                                    did={did}
                                />
                                <LabelValue
                                    label="userAgentDid"
                                    value={userAgentDid ?? 'none'}
                                />
                                <LabelValue
                                    label="verificationId"
                                    value={verificationId ?? 'none'}
                                />
                            </div>
                        </CardBody>
                    </Card>

                    <Card variant="default" className="p-4">
                        <CardHeader>
                            <h3>Default Agent for Authentication</h3>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-2">
                                {profile.service?.map((service, index) => (
                                    <Card key={index} variant="default" className="p-2">
                                        <div className="flex items-start gap-3">
                                            <RadioButton
                                                name="userAgentDid"
                                                value={did + service.id}
                                                checked={userAgentDid === (did + service.id)}
                                                onChange={setUserAgentDid}
                                                disabled={!firstAgentKey(service.capabilityInvocation,keyring)}
                                                className="mt-1"
                                            />
                                            <div>
                                                <div className="flex-1">
                                                    <p className="md">{service.name}</p>
                                                    <p className="sm">{service.type} • {service.id}</p>
                                                </div>
                                                <p className="sm">
                                                    {String(service.serviceEndpoint)}
                                                </p>
                                                {userAgentDid === (did + service.id) && <SelectVerificationMethod methods={(service as AgentService).capabilityInvocation} />}
                                            </div>
                                        </div>
                                    </Card>
                                ))} 
                                <div className="flex ml-2 gap-3">
                                    <RadioButton
                                        name="userAgentDid"
                                        value={did}
                                        checked={userAgentDid === did}
                                        onChange={setUserAgentDid}
                                        disabled={!firstAgentKey(profile.verificationMethod,keyring)}
                                        className="mt-1"
                                    />
                                    <div>
                                        <p>No agent assigned - entity authentication</p>
                                        {userAgentDid === did && <SelectVerificationMethod methods={profile.verificationMethod} />}
                                    </div> 
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card variant="error" className="p-4">
                        <CardHeader>
                            <h3>JWK Keyring - Keep this secret!  Only for testing purposes</h3>
                        </CardHeader>
                        <CardBody>
                            <div className="bg-white dark:bg-gray-600 p-3 rounded border">
                                <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap break-all">
                                    {JSON.stringify(keyring, null, 4)}
                                </pre>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                <div className="flex justify-end">
                    <Button
                        onClick={clearUserProfile}
                        variant="danger"
                    >
                        Start Over with New Identity
                    </Button>
                </div>
            </Card>
        </div>
    );
};

interface SelectVerificationMethodProps {
    methods: (string | VerificationMethod)[] | undefined;
}

function SelectVerificationMethod({ methods }: SelectVerificationMethodProps) {
    const { verificationId, setVerificationId } = useUserProfileStore();

    const options = methods?.map((e: any) => {
        if (typeof e === 'string') {
            return { id: e, label: e };
        } else {
            const vm = e as VerificationMethod;
            return { id: vm.id, label: vm.id };
        }
    }) ?? [];

    useEffect(() => {
        // Get all available verification IDs
        const availableIds = options.map((option) => option.id);

        // Check if verificationId is not set or not in the available IDs
        if (!verificationId || !availableIds.includes(verificationId)) {
            // Set to the first available ID
            if (availableIds.length > 0) {
                setVerificationId(availableIds[0]);
            } else if( verificationId ) {
                setVerificationId(null);
            }
        }
    }, [verificationId, options, setVerificationId]);

    return (
        <RadioGroup
            name="verificationId"
            options={options}
            selectedValue={verificationId || ''}
            onChange={setVerificationId}
            className="mt-1"
        />
    );
}
