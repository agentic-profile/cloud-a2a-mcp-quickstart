import { useState } from 'react';
import { EditableValueList, Page, TabbedEditableLists } from '@/components';
import agentsData from '../agents.json';
//import { buildEndpoint } from '@/tools/misc';
//import { useSettingsStore } from '@/stores';
import { PositioningStatement } from './PositioningStatement';
import { CardTitleAndBody, Card, CardHeader, CardBody } from '@/components/Card';
import ShareVentureJson from './ShareVentureJson';
import ImportVentureJson from './ImportVentureJson';
import { EditableTable, EditableTextColumn, EditableCurrencyColumn, EditableNumberColumn, EditableSelectColumn, EditableUrlColumn } from '@/components/EditableTable';
import { MarkdownGenerator } from './MarkdownGenerator';

interface TabValues {
    id: string;
    values: string[];
    selected: number;
}

const POSITIONING_TABS = [
    { id: "forWho", title: "For who", placeholder: "Enter target market..." },
    { id: "whoNeed", title: "Who needs", placeholder: "Enter customer needs or problems..." },
    { id: "name", title: "Company name", placeholder: "Company or project name..." },
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

    // Create empty positioning data
    const emptyPositioning = () => POSITIONING_TABS.map(tab => ({
        id: tab.id,
        values: [],
        selected: -1
    }));

    const [problem, setProblem] = useState<string[]>([]);
    const [marketOpportunity, setMarketOpportunity] = useState<(string | number)[][]>([]);
    const [solution, setSolution] = useState<string[]>([]);
    const [milestones, setMilestones] = useState<(string | number)[][]>([]);
    const [team, setTeam] = useState<(string | number)[][]>([]);
    const [references, setReferences] = useState<(string | number)[][]>([]);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showMarkdown, setShowMarkdown] = useState(false);

    // State to hold the values for each tab
    const [values, setValues] = useState<TabValues[]>(emptyPositioning());

    // Handle updates to tab values
    const handleUpdate = (tabId: string, values: string[], selected: number) => {
        setValues(prev => prev.map(tab => 
            tab.id === tabId 
                ? { ...tab, values, selected }
                : tab
        ));
    };

    // Handle importing venture data from JSON
    const handleImportData = (importedData: any) => {
        // Import basic arrays
        if (importedData.problem) setProblem(importedData.problem);
        if (importedData.solution) setSolution(importedData.solution);
        if (importedData.marketOpportunity) setMarketOpportunity(importedData.marketOpportunity);
        if (importedData.milestones) setMilestones(importedData.milestones);
        if (importedData.team) setTeam(importedData.team);
        if (importedData.references) setReferences(importedData.references);

        // Import positioning data
        if (importedData.positioning && Array.isArray(importedData.positioning)) {
            setValues(importedData.positioning);
        }

        // Close the import modal
        setShowImportModal(false);
    };

    // Handle clearing all venture data
    const handleClearData = () => {
        // Clear all arrays
        setProblem([]);
        setSolution([]);
        setMarketOpportunity([]);
        setMilestones([]);
        setTeam([]);
        setReferences([]);
        
        // Reset positioning data to empty state
        setValues(emptyPositioning());
    };

    // Generate Markdown summary using the MarkdownGenerator
    const generateMarkdownSummary = () => {
        return MarkdownGenerator.generateMarkdownSummary({
            problem,
            solution,
            team,
            positioning: values,
            marketOpportunity,
            milestones,
            references
        });
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
                            EditableNumberColumn("Duration in weeks"),
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
                            EditableUrlColumn("LinkedIn Profile"),
                            EditableSelectColumn("Full or part-time?", [
                                { key: "full", label: "Full-time" },
                                { key: "part", label: "Part-time" },
                                { key: "advisor", label: "Advisor" }
                            ])
                        ]}
                        values={team}
                        onUpdate={(values) => setTeam(values)}
                    />
                </CardTitleAndBody>

                <CardTitleAndBody title="Bonus: References">
                    <p className="mb-4">
                        Provide links to any additional information to help understand your venture.  Examples include
                        a link to your website, blog, full pitch deck, and video interviews of your team.
                    </p>
                    <EditableTable
                        columns={[
                            EditableUrlColumn("Link URL"),
                            EditableTextColumn("Description")
                        ]}
                        values={references}
                        onUpdate={(values) => setReferences(values)}
                    />
                </CardTitleAndBody>

                <CardTitleAndBody title="Import/Export your Venture">
                    <p className="mb-4">
                        Import existing venture data from a JSON file, export your current data, or clear all data to start fresh.
                    </p>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Import Venture JSON
                            </button>
                            <button
                                onClick={() => setShowMarkdown(true)}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Show Markdown
                            </button>
                            <button
                                onClick={handleClearData}
                                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Clear All Data
                            </button>
                        </div>
                        <ShareVentureJson
                            values={{
                                problem,
                                solution,
                                team,
                                positioning: values,
                                marketOpportunity,
                                milestones,
                                references
                            }}
                        />
                    </div>
                </CardTitleAndBody>

                {showMarkdown && (
                    <Card>
                        <CardHeader onClose={() => setShowMarkdown(false)}>
                            <h3>Markdown Summary</h3>
                        </CardHeader>
                        <CardBody>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Generated Markdown summary of your venture data
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <pre className="whitespace-pre-wrap text-sm font-mono overflow-x-auto">
                                    {generateMarkdownSummary()}
                                </pre>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => navigator.clipboard.writeText(generateMarkdownSummary())}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                                    >
                                        Copy Markdown
                                    </button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                )}
            </div>

            {/* Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Import Venture Data
                                </h2>
                                <button
                                    onClick={() => setShowImportModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <ImportVentureJson onImport={handleImportData} />
                        </div>
                    </div>
                </div>
            )}
        </Page>
    );
};

export default VenturePage;
