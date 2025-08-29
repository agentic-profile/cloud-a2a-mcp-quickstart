import { useState } from 'react';
import { 
    Cog6ToothIcon,
    UserIcon,
    ShieldCheckIcon,
    CloudIcon
} from '@heroicons/react/24/outline';
import Page from '@/components/Page';

const SettingsPage = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [language, setLanguage] = useState('en');

    const settingsSections = [
        {
            title: 'Profile',
            icon: UserIcon,
            items: [
                {
                    name: 'Display Name',
                    value: 'John Doe',
                    type: 'text',
                    editable: true
                },
                {
                    name: 'Email',
                    value: 'john.doe@example.com',
                    type: 'email',
                    editable: true
                },
                {
                    name: 'Bio',
                    value: 'AI enthusiast and developer',
                    type: 'textarea',
                    editable: true
                }
            ]
        },
        {
            title: 'Preferences',
            icon: Cog6ToothIcon,
            items: [
                {
                    name: 'Dark Mode',
                    value: darkMode,
                    type: 'toggle',
                    onChange: setDarkMode
                },
                {
                    name: 'Notifications',
                    value: notifications,
                    type: 'toggle',
                    onChange: setNotifications
                },
                {
                    name: 'Auto Save',
                    value: autoSave,
                    type: 'toggle',
                    onChange: setAutoSave
                },
                {
                    name: 'Language',
                    value: language,
                    type: 'select',
                    options: [
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Spanish' },
                        { value: 'fr', label: 'French' },
                        { value: 'de', label: 'German' }
                    ],
                    onChange: setLanguage
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
        },
        {
            title: 'Integrations',
            icon: CloudIcon,
            items: [
                {
                    name: 'AWS Services',
                    value: true,
                    type: 'toggle',
                    onChange: () => {}
                },
                {
                    name: 'Database Connections',
                    value: 3,
                    type: 'info',
                    subtitle: '3 active connections'
                },
                {
                    name: 'API Keys',
                    value: '2 active keys',
                    type: 'info',
                    subtitle: 'Last rotated: 30 days ago'
                }
            ]
        }
    ];

    const renderSettingItem = (item: any) => {
        switch (item.type) {
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
                        <button
                            onClick={() => item.onChange(!item.value)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                                item.value ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    item.value ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
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
                            className="block w-32 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                                <section.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
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
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                    Cancel
                </button>
                <button className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200">
                    Save Changes
                </button>
            </div>
        </Page>
    );
};

export default SettingsPage;
