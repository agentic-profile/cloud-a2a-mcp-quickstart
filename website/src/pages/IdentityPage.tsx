import { useState, useEffect } from 'react';
import { Page } from '@/components';
import { CreateIdentityForm, UserProfileDisplay, ImportIdentity } from '@/components';
import { wantsFocus } from '@/components/ImportIdentity';
import { useUserProfileStore } from '@/stores';

import clsx from 'clsx';


/*
interface Service {
    name: string;
    type: string;
    id: string;
    url: string;
}

const [services] = useState<Service[]>([
    {
        name: "People connector",
        type: "A2A/venture",
        id: "venture",
        url: "http://localhost:3000/a2a/venture"
    }
]);
*/

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
            setActiveTabIndex(1);
    }, []);

    const tabs = [
        {
            id: 'create',
            title: 'Create Test Identity',
            content: <CreateIdentityForm />
        },
        {
            id: 'import',
            title: 'Import from Matchwise',
            content: <ImportIdentity />
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

