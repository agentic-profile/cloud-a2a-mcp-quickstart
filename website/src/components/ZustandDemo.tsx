import { useState } from 'react';
import { useUser, useSettings, useAppActions, useIsAuthenticated } from '../stores';

export const ZustandDemo = () => {
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');

    // Using different store selectors
    const user = useUser();
    const settings = useSettings();
    const isAuthenticated = useIsAuthenticated();
    const { setUser, updateUserProfile, updateSettings, toggleSidebar, setLoading } =
        useAppActions();

    const handleLogin = () => {
        if (newUserName && newUserEmail) {
            setLoading(true);

            // Simulate API call
            setTimeout(() => {
                const mockUser = {
                    id: '1',
                    name: newUserName,
                    email: newUserEmail,
                    preferences: {
                        notifications: true,
                        newsletter: false,
                        language: 'en',
                    },
                };
                setUser(mockUser);
                setLoading(false);
                setNewUserName('');
                setNewUserEmail('');
            }, 1000);
        }
    };

    const handleLogout = () => {
        setUser(null);
    };

    const handleUpdateProfile = () => {
        if (user) {
            updateUserProfile({
                preferences: {
                    ...user.preferences,
                    newsletter: !user.preferences.newsletter,
                },
            });
        }
    };

    const handleToggleCompactMode = () => {
        updateSettings({ compactMode: !settings.compactMode });
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Zustand State Management Demo
            </h3>

            {/* Authentication Section */}
            <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-900 dark:text-white">
                    Authentication State
                </h4>
                <div className="space-y-3">
                    {!isAuthenticated ? (
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Name"
                                value={newUserName}
                                onChange={e => setNewUserName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newUserEmail}
                                onChange={e => setNewUserEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <button
                                onClick={handleLogin}
                                disabled={!newUserName || !newUserEmail}
                                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg text-white transition-colors"
                            >
                                Login
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Welcome, <span className="font-medium">{user?.name}</span>!
                            </p>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* User Profile Section */}
            {isAuthenticated && user && (
                <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-900 dark:text-white">User Profile</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <p>
                            <strong>Name:</strong> {user.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p>
                            <strong>Newsletter:</strong>{' '}
                            {user.preferences.newsletter ? 'Yes' : 'No'}
                        </p>
                        <p>
                            <strong>Notifications:</strong>{' '}
                            {user.preferences.notifications ? 'Yes' : 'No'}
                        </p>
                        <button
                            onClick={handleUpdateProfile}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-xs transition-colors"
                        >
                            Toggle Newsletter
                        </button>
                    </div>
                </div>
            )}

            {/* App Settings Section */}
            <div className="mb-6">
                <h4 className="font-medium mb-3 text-gray-900 dark:text-white">App Settings</h4>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            Sidebar Collapsed
                        </span>
                        <button
                            onClick={toggleSidebar}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-xs transition-colors"
                        >
                            {settings.sidebarCollapsed ? 'Expand' : 'Collapse'}
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            Compact Mode
                        </span>
                        <button
                            onClick={handleToggleCompactMode}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-xs transition-colors"
                        >
                            {settings.compactMode ? 'Disable' : 'Enable'}
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Auto Save</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {settings.autoSave ? 'Enabled' : 'Disabled'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Current State Display */}
            <div>
                <h4 className="font-medium mb-3 text-gray-900 dark:text-white">Current State</h4>
                <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded text-xs font-mono text-gray-700 dark:text-gray-300 overflow-auto">
                    <pre>
                        {JSON.stringify(
                            {
                                user: user ? { name: user.name, email: user.email } : null,
                                isAuthenticated,
                                settings,
                            },
                            null,
                            2
                        )}
                    </pre>
                </div>
            </div>
        </div>
    );
};
