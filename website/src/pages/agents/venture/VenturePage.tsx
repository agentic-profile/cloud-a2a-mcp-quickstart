import { useState, useCallback } from 'react';
import { EditableValueList, Page, TabbedEditableLists, Button } from '@/components';
import agentsData from '../agents.json';
import { useVentureStore } from '@/stores';
import { PositioningStatement } from './PositioningStatement';
import { CardTitleAndBody, Card, CardHeader, CardBody } from '@/components/Card';
import ShareVentureJson from './ShareVentureJson';
import ImportVentureJson from './ImportVentureJson';
import { EditableTable, EditableTextColumn, EditableCurrencyColumn, EditableNumberColumn, EditableSelectColumn, EditableUrlColumn } from '@/components/EditableTable';
import { MarkdownGenerator } from './MarkdownGenerator';
import PublishVentureToMcp from './PublishVentureToMcp';
import PublishVentureToIdentityHost from './PublishVentureToIdentityHost';


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
    const {
        positioning,
        problem,
        solution,
        marketOpportunity,
        milestones,
        team,
        references,
        updatePositioningTab,
        setProblem,
        setSolution,
        setMarketOpportunity,
        setMilestones,
        setTeam,
        setReferences,
        importVentureData,
        clearVentureData,
        prunedVentureData
    } = useVentureStore();
    
    // Find the venture agent from the agents data
    const ventureAgent = agentsData.find(agent => agent.id === 'venture')!;
    
    const [showImportModal, setShowImportModal] = useState(false);
    const [showMarkdown, setShowMarkdown] = useState(false);

    // Memoized callback functions to prevent infinite loops
    const handleProblemUpdate = useCallback((values: string[]) => {
        setProblem(values);
    }, [setProblem]);

    const handleSolutionUpdate = useCallback((values: string[]) => {
        setSolution(values);
    }, [setSolution]);

    const handleMarketOpportunityUpdate = useCallback((values: (string | number)[][]) => {
        setMarketOpportunity(values);
    }, [setMarketOpportunity]);

    const handleMilestonesUpdate = useCallback((values: (string | number)[][]) => {
        setMilestones(values);
    }, [setMilestones]);

    const handleTeamUpdate = useCallback((values: (string | number)[][]) => {
        setTeam(values);
    }, [setTeam]);

    const handleReferencesUpdate = useCallback((values: (string | number)[][]) => {
        setReferences(values);
    }, [setReferences]);

    // Handle updates to tab values
    const handleUpdate = useCallback((tabId: string, values: string[], selected: number) => {
        updatePositioningTab(tabId, values, selected);
    }, [updatePositioningTab]);

    // Handle importing venture data from JSON
    const handleImportData = (importedData: any) => {
        importVentureData(importedData);
        // Close the import modal
        setShowImportModal(false);
    };

    // Handle clearing all venture data
    const handleClearData = () => {
        clearVentureData();
    };

    // Generate Markdown summary using the MarkdownGenerator
    const generateMarkdownSummary = () => {
        return MarkdownGenerator.generateMarkdownSummary(prunedVentureData());
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
                        values={positioning}
                        selectable={true}
                        onUpdate={handleUpdate}
                    />
                    <PositioningStatement tabValues={positioning} />
                </CardTitleAndBody>

                <CardTitleAndBody title="Step 2: Problem">
                    <p>
                        Describe three or four elements of the problem your customers are facing.
                    </p>
                    <EditableValueList
                        placeholder="An aspect of your customers problem"
                        values={problem}
                        onUpdate={handleProblemUpdate}
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
                        onUpdate={handleMarketOpportunityUpdate}
                    />
                </CardTitleAndBody>

                <CardTitleAndBody title="Step 4: Solution">
                    <p className="mb-4">
                        Describe the solution to the problem as three or four bullet points.
                    </p>
                    <EditableValueList
                        placeholder="The solution to the problem"
                        values={solution}
                        onUpdate={handleSolutionUpdate}
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
                        onUpdate={handleMilestonesUpdate}
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
                        onUpdate={handleTeamUpdate}
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
                        onUpdate={handleReferencesUpdate}
                    />
                </CardTitleAndBody>

                <PublishVentureToMcp />

                <CardTitleAndBody title="Advanced Features" collapsible={true}>
                    <div className="space-y-4">
                        <div className="flex gap-3">
                            <Button
                                onClick={() => setShowImportModal(true)}
                                variant="primary"
                            >
                                Import Venture JSON
                            </Button>
                            <Button
                                onClick={() => setShowMarkdown(true)}
                                variant="success"
                            >
                                Show Markdown
                            </Button>
                            <Button
                                onClick={handleClearData}
                                variant="danger"
                            >
                                Clear All Data
                            </Button>
                        </div>
                        <ShareVentureJson
                            values={prunedVentureData()}
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
                                    <Button
                                        onClick={() => navigator.clipboard.writeText(generateMarkdownSummary())}
                                        variant="primary"
                                        size="sm"
                                    >
                                        Copy Markdown
                                    </Button>
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
                                <Button
                                    onClick={() => setShowImportModal(false)}
                                    variant="ghost"
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </Button>
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
