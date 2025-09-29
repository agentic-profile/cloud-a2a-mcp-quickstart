import { useState, useEffect } from 'react';
import clsx from 'clsx';

import { Page } from '@/components';
import { CreateIdentityForm, UserProfileDisplay } from '@/components';
import { ConnectIdentity, wantsFocus } from './ConnectIdentity';
import SelfHostIdentity from './SelfHostIdentity';
import { useUserProfileStore } from '@/stores';


export default function IdentityPage() {
    const { userProfile } = useUserProfileStore();

    return (
        <Page
            title="Decentralized Identity"
            subtitle="Set up your digital identity using agentic profile technology"
        >
            {userProfile ? (
                <UserProfileDisplay />
            ) : (
                <TabbedIdentitySources />
            )}
        </Page>
    );
};

const TabbedIdentitySources = () => {
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    useEffect(() => {
        // Check for kid and did query parameters
        if(wantsFocus())
            setActiveTabIndex(0);
    }, []);

    const tabs = [
        {
            id: 'import',
            title: 'Connect to Identity Host',
            content: <ConnectIdentity />
        },
        {
            id: 'self-host',
            title: 'Self Host Identity',
            content: <SelfHostIdentity />
        },
        {
            id: 'create',
            title: 'Create Test Identity',
            content: <CreateIdentityForm />
        }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-600 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTabIndex(index)}
                            className={clsx(
                                "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                                activeTabIndex === index
                                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                            )}
                        >
                            {tab.title}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div>
                {tabs[activeTabIndex].content}
            </div>
        </div>
    );
};

