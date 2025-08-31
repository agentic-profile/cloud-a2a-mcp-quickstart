import { useState } from 'react';
import { PlusIcon, TrashIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components';
import { useUserProfileStore } from '@/stores';
import {
    createAgenticProfile,
    //webDidToUrl
} from "@agentic-profile/common";
import {
    createEdDsaJwk
} from "@agentic-profile/auth";

interface Service {
    name: string;
    type: string;
    id: string;
    url: string;
}

export const CreateIdentityForm = () => {
    const [userName, setUserName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [services, setServices] = useState<Service[]>([
        {
            name: "People connector",
            type: "A2A/venture",
            id: "venture",
            url: "http://localhost:3000/a2a/venture"
        }
    ]);
    const [newService, setNewService] = useState<Service>({
        name: '',
        type: 'A2A',
        id: '',
        url: ''
    });
    const [serverUrl, setServerUrl] = useState('https://testing.agenticprofile.ai');
    
    const { setUserProfile } = useUserProfileStore();

    const handleCreate = async () => {
        if (!userName.trim()) {
            return;
        }

        setIsCreating(true);
        
        try {
            const services = [
                {
                    name: "People connector",
                    type: "A2A/venture",
                    id: "venture",
                    url: "http://localhost:3000/a2a/venture"
                }
            ];
            const { profile, keyring, b64uPublicKey } = await createAgenticProfile({ services, createJwkSet: createEdDsaJwk });

            profile.name = userName;
        
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
                type: "A2A/venture",
                id: "venture",
                url: "http://localhost:3000/a2a/venture"
            }
        ]);
        setShowAdvanced(false);
        setUserProfile(null);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center mb-6">
                    <div className="mx-auto w-16 h-16 bg-dodgerblue/10 rounded-full flex items-center justify-center mb-4">
                        <PlusIcon className="w-8 h-8 text-dodgerblue" />
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
                            Your name
                        </label>
                        <input
                            id="userName"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter your name"
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

                    <div className="flex gap-3">
                        <Button
                            onClick={resetForm}
                            disabled={isCreating}
                            variant="secondary"
                            size="lg"
                        >
                            Clear
                        </Button>
                        <Button
                            onClick={handleCreate}
                            disabled={!userName.trim() || isCreating}
                            loading={isCreating}
                            className="flex-1"
                            size="lg"
                        >
                            {isCreating ? 'Creating Identity...' : 'Create Digital Identity'}
                        </Button>

                    </div>
                </div>
            </div>
        </div>
    );
};
