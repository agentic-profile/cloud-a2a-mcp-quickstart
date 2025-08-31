import { useState } from 'react';

import {
    createAgenticProfile,
    //prettyJson,
    webDidToUrl
} from "@agentic-profile/common";
//import type { AgenticProfile, JWKSet } from '@agentic-profile/common/schema';
import {
    createEdDsaJwk
} from "@agentic-profile/auth";

import { UserIcon, PlusIcon, TrashIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Button, Page } from '@/components';
import { useUserProfileStore /*, type UserProfile */ } from '@/stores';

interface Service {
    name: string;
    type: string;
    id: string;
    url: string;
}

const IdentityPage = () => {
    const [userName, setUserName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [services, setServices] = useState<Service[]>([
        {
            name: "People connector",
            type: "A2A",
            id: "connect",
            url: "http://localhost:4004/a2a/connect"
        }
    ]);
    const [newService, setNewService] = useState<Service>({
        name: '',
        type: 'A2A',
        id: '',
        url: ''
    });
    const [serverUrl, setServerUrl] = useState('https://testing.agenticprofile.ai');
    const [port] = useState('4004');
    
    // Use Zustand store for user profile
    const { userProfile, setUserProfile } = useUserProfileStore();

    const handleCreate = async () => {
        if (!userName.trim()) {
            return;
        }

        setIsCreating(true);
        
        try {
            const services = [
                {
                    name: "People connector",
                    type: "A2A",
                    id: "connect",
                    url: `http://localhost:${port}/a2a/connect`
                }
            ];
            const { profile, keyring, b64uPublicKey } = await createAgenticProfile({ services, createJwkSet: createEdDsaJwk });
        
            // Call the backend to create the profile
            const response = await fetch("https://testing.agenticprofile.ai/agentic-profile", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ profile, b64uPublicKey })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setUserProfile({profile: result.profile, keyring});            
        } catch (error) {
            console.error('Error creating identity:', error);
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

    const addService = () => {
        if (newService.name && newService.id && newService.url) {
            setServices([...services, { ...newService }]);
            setNewService({ name: '', type: 'A2A', id: '', url: '' });
        }
    };

    const removeService = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    };

    const updateService = (index: number, field: keyof Service, value: string) => {
        const updatedServices = [...services];
        updatedServices[index] = { ...updatedServices[index], [field]: value };
        setServices(updatedServices);
    };

    const resetForm = () => {
        setUserName('');
        setServices([
            {
                name: "People connector",
                type: "A2A",
                id: "connect",
                url: "http://localhost:4004/a2a/connect"
            }
        ]);
        setUserProfile(null);
        setShowAdvanced(false);
    };

    if (userProfile) {
        return (
            <Page
                title="Identity Created"
                subtitle="Your digital identity has been successfully created"
                maxWidth="lg"
            >
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                                <UserIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Identity Created Successfully!
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Your agentic profile has been created and published
                            </p>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Profile Information</h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Username:</span>
                                        <span className="ml-2 text-gray-600 dark:text-gray-400">{userName}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">DID:</span>
                                        <span className="ml-2 text-gray-600 dark:text-gray-400 font-mono break-all">{userProfile.profile.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <h4>Services ({services.length})</h4>
                                <div className="space-y-2">
                                    {services.map((service: Service, index: number) => (
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
                        </div>

                        <div className="flex space-x-3">
                            <Button
                                onClick={resetForm}
                                variant="secondary"
                                className="flex-1"
                            >
                                Create Another Identity
                            </Button>
                            <Button
                                onClick={() => window.open(webDidToUrl(userProfile.profile.id),'_blank')}
                                className="flex-1"
                            >
                                View Profile
                            </Button>
                        </div>
                    </div>
                </div>
            </Page>
        );
    }

    return (
        <Page
            title="Create Identity"
            subtitle="Set up your digital identity using agentic profile technology"
            maxWidth="lg"
        >
            <div className="max-w-2xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="text-center mb-6">
                        <div className="mx-auto w-16 h-16 bg-dodgerblue/10 rounded-full flex items-center justify-center mb-4">
                            <UserIcon className="w-8 h-8 text-dodgerblue" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Create Your Digital Identity
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Create an agentic profile that will be published to the testing.agenticprofile.ai service
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div>
                            <label htmlFor="userName" className="form-label">
                                Username
                            </label>
                            <input
                                id="userName"
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter your username"
                                className="form-input"
                                autoFocus
                            />
                        </div>

                        {/* Server Configuration */}
                        <div>
                            <label htmlFor="serverUrl" className="form-label">
                                Agentic Profile Service
                            </label>
                            <input
                                id="serverUrl"
                                type="url"
                                value={serverUrl}
                                onChange={(e) => setServerUrl(e.target.value)}
                                placeholder="https://testing.agenticprofile.ai"
                                className="form-input"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                The service where your agentic profile will be published
                            </p>
                        </div>

                        {/* Advanced Options */}
                        <div>
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center text-sm text-dodgerblue hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-md transition-colors"
                            >
                                <Cog6ToothIcon className="w-4 h-4 mr-2" />
                                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                            </button>
                        </div>

                        {showAdvanced && (
                            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <h4 className="font-medium text-gray-900 dark:text-white">Configure Services</h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
                                    Define the services that your agentic profile can connect to
                                </p>

                                {/* Existing Services */}
                                <div className="space-y-3">
                                    {services.map((service, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-2 items-center p-3 bg-white dark:bg-gray-600 rounded border">
                                            <div className="col-span-3">
                                                <input
                                                    type="text"
                                                    value={service.name}
                                                    onChange={(e) => updateService(index, 'name', e.target.value)}
                                                    placeholder="Service name"
                                                    className="form-input-small"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <select
                                                    value={service.type}
                                                    onChange={(e) => updateService(index, 'type', e.target.value)}
                                                    className="form-select-small"
                                                >
                                                    <option value="A2A">A2A</option>
                                                    <option value="API">API</option>
                                                    <option value="Webhook">Webhook</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <input
                                                    type="text"
                                                    value={service.id}
                                                    onChange={(e) => updateService(index, 'id', e.target.value)}
                                                    placeholder="Service ID"
                                                    className="form-input-small"
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <input
                                                    type="url"
                                                    value={service.url}
                                                    onChange={(e) => updateService(index, 'url', e.target.value)}
                                                    placeholder="Service URL"
                                                    className="form-input-small"
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <button
                                                    onClick={() => removeService(index)}
                                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Add New Service */}
                                <div className="grid grid-cols-12 gap-2 items-center p-3 bg-white dark:bg-gray-600 rounded border">
                                    <div className="col-span-3">
                                        <input
                                            type="text"
                                            value={newService.name}
                                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                            placeholder="Service name"
                                            className="form-input-small"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <select
                                            value={newService.type}
                                            onChange={(e) => setNewService({ ...newService, type: e.target.value })}
                                            className="form-select-small"
                                        >
                                            <option value="A2A">A2A</option>
                                            <option value="API">API</option>
                                            <option value="Webhook">Webhook</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="text"
                                            value={newService.id}
                                            onChange={(e) => setNewService({ ...newService, id: e.target.value })}
                                            placeholder="Service ID"
                                            className="form-input-small"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <input
                                            type="url"
                                            value={newService.url}
                                            onChange={(e) => setNewService({ ...newService, url: e.target.value })}
                                            placeholder="Service URL"
                                            className="form-input-small"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <button
                                            onClick={addService}
                                            disabled={!newService.name || !newService.id || !newService.url}
                                            className="p-1 text-dodgerblue hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={handleCreate}
                            disabled={!userName.trim() || isCreating}
                            loading={isCreating}
                            className="w-full"
                            size="lg"
                        >
                            {isCreating ? 'Creating Identity...' : 'Create Digital Identity'}
                        </Button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Your agentic profile will be securely created and published to the specified service
                        </p>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default IdentityPage;
