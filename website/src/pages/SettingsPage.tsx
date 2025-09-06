import { useState } from 'react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { 
    Cog6ToothIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon,
    ArrowRightIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { Switch, Button, Page } from '@/components';
import { useSettingsStore } from '@/stores';
import { DEFAULT_SERVER_URLS } from '@/tools/misc';

const ServerUrlSetting = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState('');
    
    const { serverUrl, setServerUrl } = useSettingsStore();

    const handleEdit = () => {
        setTempValue(serverUrl);
        setIsEditing(true);
    };

    const handleSave = () => {
        setServerUrl(tempValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempValue(serverUrl);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <div className="py-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Server URL
                    </p>
                    {isEditing ? (
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="http://localhost:3000"
                                    className="flex-1 px-3 py-2 border-2 border-dodgerblue rounded-md bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-dodgerblue focus:border-dodgerblue"
                                    autoFocus
                                />
                                <Button
                                    onClick={handleSave}
                                    variant="primary"
                                >
                                    <CheckIcon className="w-4 h-4" />
                                    <span>Save</span>
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    variant="secondary"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                    <span>Cancel</span>
                                </Button>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400">Quick options:</p>
                                <div className="flex flex-wrap gap-2">
                                    {DEFAULT_SERVER_URLS.map((url, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setTempValue(url)}
                                            className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            {url}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {serverUrl}
                            </span>
                            <Button
                                onClick={handleEdit}
                                variant="ghost"
                                size="sm"
                                className="px-2 py-1 text-dodgerblue hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                                <PencilIcon className="w-4 h-4" />
                                <span className="text-xs">Edit</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SettingsPage = () => {
    const { theme, setTheme } = useTheme();
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
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Digital Identity
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Create and manage your digital identity profile
                                    </p>
                                </div>
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
