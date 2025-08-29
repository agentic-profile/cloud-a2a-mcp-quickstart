import { useState } from 'react';
import { useTheme } from 'next-themes';
import { 
    Cog6ToothIcon,
    ShieldCheckIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { Switch } from '@/components/Switch';
import Page from '@/components/Page';
import { useSettingsStore } from '@/stores';

const SettingsPage = () => {
    const [isEditingServerUrl, setIsEditingServerUrl] = useState(false);
    const [tempServerUrl, setTempServerUrl] = useState('');
    const { theme, setTheme } = useTheme();

    const {
        serverUrl,
        setServerUrl
    } = useSettingsStore();

    const handleEditServerUrl = () => {
        setTempServerUrl(serverUrl);
        setIsEditingServerUrl(true);
    };

    const handleSaveServerUrl = () => {
        setServerUrl(tempServerUrl);
        setIsEditingServerUrl(false);
    };

    const handleCancelServerUrl = () => {
        setTempServerUrl(serverUrl);
        setIsEditingServerUrl(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveServerUrl();
        } else if (e.key === 'Escape') {
            handleCancelServerUrl();
        }
    };

    const settingsSections = [
        {
            title: 'Preferences',
            icon: Cog6ToothIcon,
            items: [
                {
                    name: 'Server URL',
                    value: isEditingServerUrl ? tempServerUrl : serverUrl,
                    isEditing: isEditingServerUrl,
                    type: 'editable-text',
                    onEdit: handleEditServerUrl,
                    onSave: handleSaveServerUrl,
                    onCancel: handleCancelServerUrl,
                    onChange: setTempServerUrl,
                    placeholder: 'http://localhost:3000'
                },
                {
                    name: 'Dark Mode',
                    value: theme === 'dark',
                    type: 'toggle',
                    onChange: (enabled: boolean) => setTheme(enabled ? 'dark' : 'light')
                }
            ]
        },
        {
            title: 'Security',
            icon: ShieldCheckIcon,
            items: [
                {
                    name: 'Two-Factor Authentication',
                    value: false,
                    type: 'toggle',
                    onChange: () => {}
                },
                {
                    name: 'Session Timeout',
                    value: '30 minutes',
                    type: 'select',
                    options: [
                        { value: '15', label: '15 minutes' },
                        { value: '30', label: '30 minutes' },
                        { value: '60', label: '1 hour' },
                        { value: '1440', label: '24 hours' }
                    ],
                    onChange: () => {}
                }
            ]
        }
    ];

    const renderSettingItem = (item: any) => {
        switch (item.type) {
            case 'editable-text':
                return (
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {item.name}
                            </p>
                            {item.isEditing ? (
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) => item.onChange(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={item.placeholder}
                                        className="flex-1 px-3 py-2 border-2 border-dodgerblue rounded-md bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-dodgerblue focus:border-dodgerblue"
                                        autoFocus
                                    />
                                    <button
                                        onClick={item.onSave}
                                        className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                                    >
                                        <CheckIcon className="w-4 h-4" />
                                        <span>Save</span>
                                    </button>
                                    <button
                                        onClick={item.onCancel}
                                        className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                        <span>Cancel</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                        {item.value}
                                    </span>
                                    <button
                                        onClick={item.onEdit}
                                        className="px-2 py-1 text-dodgerblue hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors duration-200 flex items-center space-x-1"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                        <span className="text-xs">Edit</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            
            case 'text':
                return (
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {item.name}
                            </p>
                            {item.subtitle && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {item.subtitle}
                                </p>
                            )}
                        </div>
                        <input
                            type="text"
                            value={item.value}
                            onChange={(e) => item.onChange(e.target.value)}
                            placeholder={item.placeholder}
                            className="block w-64 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:border-dodgerblue focus:ring-dodgerblue"
                        />
                    </div>
                );
            
            case 'toggle':
                return (
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {item.name}
                            </p>
                            {item.subtitle && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {item.subtitle}
                                </p>
                            )}
                        </div>
                        <Switch
                            isSelected={item.value}
                            onValueChange={item.onChange}
                            size="sm"
                            color="primary"
                        />
                    </div>
                );
            
            case 'select':
                return (
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {item.name}
                            </p>
                            {item.subtitle && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {item.subtitle}
                                </p>
                            )}
                        </div>
                        <select
                            value={item.value}
                            onChange={(e) => item.onChange(e.target.value)}
                            className="block w-32 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:border-dodgerblue focus:ring-dodgerblue"
                        >
                            {item.options.map((option: any) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            
            case 'info':
                return (
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {item.name}
                            </p>
                            {item.subtitle && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {item.subtitle}
                                </p>
                            )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {item.value}
                        </span>
                    </div>
                );
            
            default:
                return (
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {item.name}
                            </p>
                            {item.subtitle && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {item.subtitle}
                                </p>
                            )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {item.value}
                        </span>
                    </div>
                );
        }
    };

    return (
        <Page
            title="Settings"
            subtitle="Manage your account preferences and application settings"
        >

            <div className="space-y-6">
                {settingsSections.map((section) => (
                    <div
                        key={section.title}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                            <div className="flex items-center space-x-3">
                                <section.icon className="w-5 h-5 text-dodgerblue dark:text-dodgerblue" />
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {section.title}
                                </h2>
                            </div>
                        </div>
                        
                        <div className="px-6 py-4 space-y-4">
                            {section.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                >
                                    {renderSettingItem(item)}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dodgerblue transition-colors duration-200">
                    Cancel
                </button>
                <button className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-dodgerblue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dodgerblue transition-colors duration-200">
                    Save Changes
                </button>
            </div>
        </Page>
    );
};

export default SettingsPage;
