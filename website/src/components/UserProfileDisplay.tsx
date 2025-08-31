import { UserIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components';
import { useUserProfileStore } from '@/stores';
import { webDidToUrl } from "@agentic-profile/common";

export const UserProfileDisplay = () => {
    const { userProfile, clearUserProfile } = useUserProfileStore();

    if (!userProfile) {
        return null;
    }

    const { profile, keyring } = userProfile;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                        <UserIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p>
                        Your agentic profile has been created and published
                    </p>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h4>Basic Information</h4>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                                <span className="ml-2 text-gray-600 dark:text-gray-400">{profile.name || 'Not specified'}</span>
                            </div>
                            <div className="flex items-start justify-between">
                                <div className="flex items-start">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">DID:</span>
                                    <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono break-all">{userProfile.profile.id}</span>
                                </div>
                                <button
                                    onClick={() => window.open(webDidToUrl(userProfile.profile.id), '_blank')}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                                    title="Open DID in new tab"
                                >
                                    <ArrowTopRightOnSquareIcon className="w-7 h-7" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h4>Agents</h4>
                        <div className="space-y-2">
                            {profile.service?.map((service, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900 dark:text-white">{service.name}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">{service.type} • {service.id}</div>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono max-w-xs truncate">
                                        {service.url}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                        <h4>JWK Keyring - Keep this secret!  Only for testing purposes</h4>
                        <div className="bg-white dark:bg-gray-600 p-3 rounded border">
                            <pre className="text-xs text-gray-800 dark:text-gray-200 overflow-x-auto whitespace-pre-wrap break-all">
                                {JSON.stringify(keyring, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <Button
                        onClick={clearUserProfile}
                        variant="secondary"
                        className="flex-1"
                    >
                        Start Over with New Identity
                    </Button>
                </div>
            </div>
        </div>
    );
};
