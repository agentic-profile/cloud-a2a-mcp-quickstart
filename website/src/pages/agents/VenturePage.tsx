import { useState } from 'react';
import { Card, CardBody, Page, TabbedEditableLists } from '@/components';
import agentsData from './agents.json';
//import { buildEndpoint } from '@/tools/misc';
//import { useSettingsStore } from '@/stores';

interface TabValues {
    id: string;
    values: string[];
    selected: number;
}

const POSITIONING_TABS = [
    { id: "for-who", title: "For who", placeholder: "Enter target market..." },
    { id: "who-need", title: "Who needs", placeholder: "Enter customer needs or problems..." },
    { id: "product-category", title: "Product Category", placeholder: "Enter product category..." },
    { id: "key-benefit", title: "Key Benefit", placeholder: "Enter key benefit..." },
    { id: "unlike", title: "Unlike", placeholder: "Name of closest competitor..." },
    { id: "primary-differentiator", title: "Primary Differentiator", placeholder: "Enter primary differentiator..." }
]

const VenturePage = () => {
    //const { serverUrl } = useSettingsStore();
    // Find the venture agent from the agents data
    const ventureAgent = agentsData.find(agent => agent.id === 'venture');
    //const rpcUrl = serverUrl && ventureAgent ? buildEndpoint(serverUrl, ventureAgent?.agentUrl ) : null;

    // State to hold the values for each tab
    const [values, setValues] = useState<TabValues[]>(
        POSITIONING_TABS.map(tab => ({
            id: tab.id,
            values: [],
            selected: -1
        }))
    );

    // Handle updates to tab values
    const handleUpdate = (tabId: string, values: string[], selected: number) => {
        setValues(prev => prev.map(tab => 
            tab.id === tabId 
                ? { ...tab, values, selected }
                : tab
        ));
    };

    if (!ventureAgent) {
        return (
            <Page
                title="Venture Agent"
                subtitle="Agent not found"
                maxWidth="6xl"
            >
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        Venture Agent data not found. Please check the agents configuration.
                    </p>
                </div>
            </Page>
        );
    }

    return (
        <Page
            title={ventureAgent.name}
            subtitle="Your AI-powered business development partner for strategic growth and partnerships"
            maxWidth="6xl"
        >
            <div className="text-center">
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <CardBody>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                            Ready to Accelerate Your Business Growth?
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                            Let the Venture Agent help you build strategic partnerships and unlock new opportunities
                        </p>
                    </CardBody>
                </Card>
            </div>

            {/* Tabbed Option List */}
            <TabbedEditableLists 
                tabs={POSITIONING_TABS}
                values={values}
                onUpdate={handleUpdate}
            />
        </Page>
    );
};

export default VenturePage;
