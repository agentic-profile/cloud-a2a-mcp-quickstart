import { useState, useCallback, useEffect, useRef } from 'react';
import { EditableValueList, Page, TabbedEditableLists } from '@/components';
import { useVentureStore } from '@/stores';
import { PositioningStatement } from './PositioningStatement';
import { CardTitleAndBody, Card, CardBody } from '@/components/Card';
import { EditableTable, EditableTextColumn, EditableCurrencyColumn, EditableNumberColumn, EditableSelectColumn, EditableUrlColumn } from '@/components/EditableTable';
import PublishVentureToMcp from './PublishVentureToMcp';
import EnlistAgent from './EnlistAgent';
import { JsonRpcDebug, type HttpRequest } from '@/components/JsonRpcDebug';
import AdvancedFeatures from './AdvancedFeatures';
import type { AttributedString, StringOrNumberTable } from '@/stores/ventureStore';
import ShowMarkdown from './ShowMarkdown';


const POSITIONING_TABS = [
    { id: "forWho", title: "For who", placeholder: "Enter target market..." },
    { id: "whoNeed", title: "Who (needs/wants)", placeholder: "Enter customer needs or problems..." },
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
        hiddenRows,
        updatePositioningTab,
        setHiddenRows,
        setProblem,
        setSolution,
        setMarketOpportunity,
        setMilestones,
        setTeam,
        setReferences,
    } = useVentureStore();
    
    const [httpRequest, setHttpRequest] = useState<HttpRequest | null>(null);
    const [isShareCollapsed, setIsShareCollapsed] = useState(true);
    const enlistAgentRef = useRef<HTMLDivElement>(null);

    // Handle fragment identifier scrolling
    useEffect(() => {
        const hash = window.location.hash;
        if (hash === '#enlist-agent' && enlistAgentRef.current) {
            // Delay scroll slightly to ensure page is fully rendered
            setIsShareCollapsed(false);
            setTimeout(() => {
                enlistAgentRef.current?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }, []);

    // Memoized callback functions to prevent infinite loops
    const handleProblemUpdate = useCallback((values: AttributedString[]) => {
        setProblem(values);
    }, [setProblem]);

    const handleSolutionUpdate = useCallback((values: AttributedString[]) => {
        setSolution(values);
    }, [setSolution]);

    const handleMarketOpportunityUpdate = useCallback((values: StringOrNumberTable, hidden: StringOrNumberTable | undefined) => {
        setMarketOpportunity(values);
        if( hidden !== undefined )
            setHiddenRows({ ...hiddenRows, marketOpportunity: hidden });
    }, [setMarketOpportunity]);

    const handleMilestonesUpdate = useCallback((values: StringOrNumberTable, hidden: StringOrNumberTable | undefined) => {
        setMilestones(values);
        if( hidden !== undefined )
            setHiddenRows({ ...hiddenRows, milestones: hidden });
    }, [setMilestones]);

    const handleTeamUpdate = useCallback((values: StringOrNumberTable, hidden: StringOrNumberTable | undefined) => {
        setTeam(values);
        if( hidden !== undefined )
            setHiddenRows({ ...hiddenRows, team: hidden });
    }, [setTeam]);

    const handleReferencesUpdate = useCallback((values: StringOrNumberTable, hidden: StringOrNumberTable | undefined) => {
        setReferences(values);
        if( hidden !== undefined )
            setHiddenRows({ ...hiddenRows, references: hidden });
    }, [setReferences]);

    // Handle updates to tab values
    const handleUpdate = useCallback((tabId: string, values: string[], selected: number) => {
        updatePositioningTab(tabId, values, selected);
    }, [updatePositioningTab]);

    return (
        <Page
            title="Venture Agent/Northstar Worksheet"
            //subtitle="This AI-powered agent will help you find investors, technology providers, and talent"
            maxWidth="6xl"
        >
            <div className="space-y-4">
                <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <CardBody>
                        <div className="space-y-4 p-6">
                            <p className="lg">
                                Use this interactive tool to help summarize your business venture, generate an elevator
                                pitch, and set milestones.  This is not
                                a full <a href="https://www.slideshare.net/slideshow/sequoia-capital-pitchdecktemplate/46231251" target="_blank">Sequoia ready pitch deck</a>,
                                but it does make sure you have covered the basics.
                            </p>
                            <p className="lg">
                                You can publish a summary on the Agentic Web with our
                                MCP service so you can be found by 
                                investors, technology providers, and talent (see Publish section below).  You can
                                also use the generated markdown summary with your favorite generative AI tool (see Markdown Summary section below).
                            </p>
                            <p className="lg">
                                <strong>NOTE:</strong> The information you type is only stored in your browser's local storage.
                                If you want to publish your venture to the Agentic Web, please use the publish section below.
                            </p>
                        </div>
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
                        hiddenRows={hiddenRows?.marketOpportunity}
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
                        hiddenRows={hiddenRows?.milestones}
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
                        hiddenRows={hiddenRows?.team}
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
                        hiddenRows={hiddenRows?.references}
                        onUpdate={handleReferencesUpdate}
                    />
                </CardTitleAndBody>

                <ShowMarkdown />

                <CardTitleAndBody title="Share to the Agentic Web (and the World!)"
                    variant="success"
                    collapsed={isShareCollapsed}
                    >
                    <div className="space-y-4">
                        <p className="mb-4">
                            <strong>NOTE:</strong> This section is for advanced users.
                        </p>
                        <PublishVentureToMcp onSubmitHttpRequest={setHttpRequest} />
                        <div ref={enlistAgentRef}>
                            <EnlistAgent onSubmitHttpRequest={setHttpRequest}/>
                        </div>
                    </div>
                </CardTitleAndBody>

                {httpRequest && (
                    <div className="mt-6">
                        <JsonRpcDebug
                            httpRequest={httpRequest}
                            onClose={()=>setHttpRequest(null)}
                        />
                    </div>
                )}

                <AdvancedFeatures />
            </div>
        </Page>
    );
};

export default VenturePage;
