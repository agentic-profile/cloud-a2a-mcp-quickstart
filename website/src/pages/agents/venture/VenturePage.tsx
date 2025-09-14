import { useState } from 'react';
import { Card, CardBody, EditableValueList, Page, TabbedEditableLists } from '@/components';
import agentsData from '../agents.json';
//import { buildEndpoint } from '@/tools/misc';
//import { useSettingsStore } from '@/stores';
import { PositioningStatement } from './PositioningStatement';
import { CardTitleAndBody } from '@/components/Card';
import { EditableTable, EditableTextColumn, EditableCurrencyColumn } from '@/components/EditableTable';

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
    const ventureAgent = agentsData.find(agent => agent.id === 'venture')!;
    //const rpcUrl = serverUrl && ventureAgent ? buildEndpoint(serverUrl, ventureAgent?.agentUrl ) : null;

    const [problem, setProblem] = useState<string[]>([]);
    const [marketOpportunity, setMarketOpportunity] = useState<string[][]>([]);
    const [solution, setSolution] = useState<string[]>([]);
    const [milestones, setMilestones] = useState<string[][]>([]);
    const [team, setTeam] = useState<string[][]>([]);


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

    return (
        <Page
            title={ventureAgent.name}
            //subtitle="This AI-powered agent will help you find investors, technology providers, and talent"
            maxWidth="6xl"
        >
            <div className="space-y-4">
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <CardBody>
                        <p className="text-lg text-gray-600 dark:text-gray-400 m-6">
                            Use this interactive tool to help summarize your business venture, generate an elevator
                            pitch, and set milestones.  This is not
                            a full <a href="https://www.slideshare.net/slideshow/sequoia-capital-pitchdecktemplate/46231251" target="_blank">Sequoia ready pitch deck</a>,
                            but it does make sure you have covered the basics.  We will publish this summary with MCP so you can be found by 
                            investors, technology providers, and talent.  It only takes a 
                            few minutes to finish!
                        </p>
                    </CardBody>
                </Card>

                {/* Tabbed Option List */}
                <CardTitleAndBody title="Step 1: Positioning Worksheet">
                    <p className="mb-4">
                        This worksheet is based on Geoffrey Moore's
                        book <a href="https://en.wikipedia.org/wiki/Crossing_the_Chasm" target="_blank">Crossing the Chasm</a>.
                        Use each tab to brainstorm your business venture and then select the best option from each tab to create a positioning
                        statement (shown below).
                    </p>
                    <TabbedEditableLists 
                        tabs={POSITIONING_TABS}
                        values={values}
                        selectable={true}
                        onUpdate={handleUpdate}
                    />
                    <PositioningStatement tabValues={values} />
                </CardTitleAndBody>

                <CardTitleAndBody title="Step 2: Problem">
                    <p>
                        Describe three or four elements of the problem your customers are facing.
                    </p>
                    <EditableValueList
                        placeholder="An aspect of your customers problem"
                        values={problem}
                        onUpdate={(values) => setProblem(values)}
                    />
                </CardTitleAndBody>

                <CardTitleAndBody title="Step 3: Market Opportunity">
                    <p className="mb-4">
                        Describe the market segment and the size of the market opportunity.
                    </p>
                    <EditableTable
                        columns={[
                            EditableTextColumn("Market Segment"),
                            EditableCurrencyColumn("Size (TAM)", "USD")
                        ]}
                        values={marketOpportunity}
                        onUpdate={(values) => setMarketOpportunity(values)}
                    />
                </CardTitleAndBody>

                <CardTitleAndBody title="Step 4: Solution">
                    <p className="mb-4">
                        Describe the solution to the problem as three or four bullet points.
                    </p>
                    <EditableValueList
                        placeholder="The solution to the problem"
                        values={solution}
                        onUpdate={(values) => setSolution(values)}
                    />
                </CardTitleAndBody>

                <CardTitleAndBody title="Step 5: Milestones">
                    <p className="mb-4">
                        Describe three or four milestones for the project, how long each should take,
                        and how much funding is needed for each milestone.
                    </p>
                    <EditableTable
                        columns={[
                            EditableTextColumn("Milestone"),
                            EditableTextColumn("Duration"),
                            EditableCurrencyColumn("Funding Needed", "USD")
                        ]}
                        values={milestones}
                        onUpdate={(values) => setMilestones(values)}
                    />
                </CardTitleAndBody>

                <CardTitleAndBody title="Step 6: Team">
                <EditableTable
                    columns={[
                        EditableTextColumn("Name"),
                        EditableTextColumn("LinkedIn Profile"),
                        EditableTextColumn("Full or part-time?")
                    ]}
                    values={team}
                    onUpdate={(values) => setTeam(values)}
                />
                </CardTitleAndBody>
            </div>
        </Page>
    );
};

export default VenturePage;
