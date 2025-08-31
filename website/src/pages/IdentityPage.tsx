import { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { Button, Page } from '@/components';

const IdentityPage = () => {
    const [userName, setUserName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const handleCreate = async () => {
        if (!userName.trim()) {
            return;
        }

        setIsCreating(true);
        
        try {
            // TODO: Implement actual identity creation logic
            console.log('Creating identity for user:', userName);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // TODO: Handle success - redirect or show success message
            alert(`Identity created for ${userName}!`);
            
        } catch (error) {
            console.error('Error creating identity:', error);
            // TODO: Handle error - show error message
            alert('Error creating identity. Please try again.');
        } finally {
            setIsCreating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && userName.trim()) {
            handleCreate();
        }
    };

    return (
        <Page
            title="Create Identity"
            subtitle="Set up your digital identity profile"
            maxWidth="lg"
        >
            <div className="max-w-md mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="text-center mb-6">
                        <div className="mx-auto w-16 h-16 bg-dodgerblue/10 rounded-full flex items-center justify-center mb-4">
                            <UserIcon className="w-8 h-8 text-dodgerblue" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Create Your Identity
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Enter a username to create your digital identity profile
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                id="userName"
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter your username"
                                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-dodgerblue focus:border-dodgerblue transition-colors"
                                autoFocus
                            />
                        </div>

                        <Button
                            onClick={handleCreate}
                            disabled={!userName.trim() || isCreating}
                            loading={isCreating}
                            className="w-full"
                            size="lg"
                        >
                            {isCreating ? 'Creating...' : 'Create Identity'}
                        </Button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Your identity will be securely stored and can be used across the platform
                        </p>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default IdentityPage;
