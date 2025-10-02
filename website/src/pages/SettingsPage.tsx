import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { 
    Cog6ToothIcon,
    ArrowRightIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { Switch, Page, EditableUri, LabelDid } from '@/components';
import { useSettingsStore, useUserProfileStore } from '@/stores';
import { DEFAULT_SERVER_URLS } from '@/tools/net';

const ServerUrlSetting = () => {
    const { serverUrl, setServerUrl } = useSettingsStore();

    return (
        <div className="py-3 border-b border-gray-100 dark:border-gray-700">
            <EditableUri
                label="Server URL"
                value={serverUrl}
                placeholder="http://localhost:3000"
                options={DEFAULT_SERVER_URLS}
                onUpdate={setServerUrl}
            />
        </div>
    );
};

const SettingsPage = () => {
    const { theme, setTheme } = useTheme();
    const { userProfile } = useUserProfileStore();
    const did = userProfile?.profile.id;
    const navigate = useNavigate();

    return (
        <Page
            title="Settings"
            subtitle="Manage your account preferences and application settings"
        >
            <div className="space-y-6">
                {/* Preferences Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                        <div className="flex items-center space-x-3">
                            <Cog6ToothIcon className="w-5 h-5 text-dodgerblue dark:text-dodgerblue flex-shrink-0" />
                            <h2 className="mb-0">Preferences</h2>
                        </div>
                    </div>
                    
                    <div className="px-6 py-4 space-y-4">
                        {/* Server URL Setting */}
                        <ServerUrlSetting />

                        {/* Dark Mode Setting */}
                        <div className="py-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Dark Mode
                                    </p>
                                </div>
                                <Switch
                                    isSelected={theme === 'dark'}
                                    onValueChange={(enabled) => setTheme(enabled ? 'dark' : 'light')}
                                    size="sm"
                                    color="primary"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Identity Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                        <div className="flex items-center space-x-3">
                            <UserIcon className="w-5 h-5 text-dodgerblue dark:text-dodgerblue flex-shrink-0" />
                            <h2 className="mb-0">Identity</h2>
                        </div>
                    </div>
                    
                    <div className="px-6 py-4 space-y-4">
                        {/* Digital Identity Setting */}
                        <div className="py-3">
                            <div className="flex items-center justify-between">
                                { did ? <LabelDid label="Your Digital Id" did={did} /> 
                                    : <p className="md">No identity configured. Please create and manage your digital identity...</p> }
                                <button
                                    onClick={() => navigate('/identity')}
                                    className="flex items-center text-sm text-dodgerblue hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-md transition-colors"
                                >
                                    <span>Manage</span>
                                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default SettingsPage;
