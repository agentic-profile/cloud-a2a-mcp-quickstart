import { useUserProfileStore } from '@/stores';
import { Button } from '@/components';

export const UserProfileStatus = () => {
    const { userProfile, clearUserProfile } = useUserProfileStore();

    if (!userProfile) {
        return (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    No user profile found. Create one in the Identity page.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium text-green-900 dark:text-green-100">
                        Profile Loaded
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                        DID: {userProfile.profile.id}
                    </p>
                </div>
                <Button
                    onClick={clearUserProfile}
                    variant="secondary"
                    size="sm"
                >
                    Clear Profile
                </Button>
            </div>
        </div>
    );
};
