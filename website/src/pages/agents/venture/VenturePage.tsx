import { useState } from 'react';
import { Card, CardBody, Page, TabbedEditableLists } from '@/components';
import agentsData from '../agents.json';
//import { buildEndpoint } from '@/tools/misc';
//import { useSettingsStore } from '@/stores';
import { PositioningStatement } from './PositioningStatement';
import { CardTitleAndBody } from '@/components/Card';

interface TabValues {
    id: string;
    values: string[];
    selected: number;
}

const POSITIONING_TABS = [
    { id: "forWho", title: "For who", placeholder: "Enter target market..." },
    { id: "whoNeed", title: "Who needs", placeholder: "Enter customer needs or problems..." },
    { id: "productCategory", title: "Product Category", placeholder: "Enter product category..." },
    { id: "keyBenefit", title: "Key Benefit", placeholder: "Enter key benefit..." },
    { id: "unlike", title: "Unlike", placeholder: "Name of closest competitor..." },
    { id: "primaryDifferentiator", title: "Primary Differentiator", placeholder: "Enter primary differentiator..." }
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
            subtitle="This AI-powered agent will help you find investors, technology providers, and talent"
            maxWidth="6xl"
        >
            <div className="space-y-4">
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <CardBody>
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
                            Join the Northstar Program
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                            Use this interactive tool to help summarize your business venture, generate an elevator
                            pitch, and set milestones.  We will publish your profile with MCP so you can be found by 
                            investors, technology providers, and talent.  It only takes a 
                            few minutes to get started!
                        </p>
                    </CardBody>
                </Card>

                {/* Tabbed Option List */}
                <CardTitleAndBody title="Step 1: Positioning Worksheet">
                    <p className="mb-4">
                        This worksheet is based on Geoffrey A. Moore's
                        book <a href="https://en.wikipedia.org/wiki/Crossing_the_Chasm" target="_blank">Crossing the Chasm</a>.
                        Use each tab to brainstorm your business venture and then select the best option from each tab to create a positioning
                        statement (shown below).
                    </p>
                    <TabbedEditableLists 
                        tabs={POSITIONING_TABS}
                        values={values}
                        onUpdate={handleUpdate}
                    />
                </CardTitleAndBody>

                <CardTitleAndBody title="Your Positioning Statement">
                    <PositioningStatement tabValues={values} />
                </CardTitleAndBody>
            </div>
        </Page>
    );
};

export default VenturePage;
