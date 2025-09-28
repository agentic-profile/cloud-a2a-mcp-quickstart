import { useState } from 'react';
import { Page, Card, CardBody, JsonRpcDebug, LabelValue } from '@/components';
import { StarIcon } from '@heroicons/react/24/outline';
import { useSettingsStore } from '@/stores';
import { buildEndpoint } from '@/tools/net';
import DeleteReputationItem from './DeleteReputationItem';
import UpdateReputationItem from './UpdateReputationItem';
import ReadReputationItem from './ReadReputationItem';
import ListByReporter from './ListByReporter';
import ListBySubject from './ListBySubject';
import ReputationItemKey from './ReputationItemKey';
import { type HttpRequest } from '@/components/JsonRpcDebug';

const McpReputationPage = () => {
    const { serverUrl } = useSettingsStore();
    const [reputationItemKey, setReputationItemKey] = useState<string>('default');
    const [httpRequest, setHttpRequest] = useState<HttpRequest | null>(null);

    // Construct the MCP endpoint URL
    const mcpEndpoint = buildEndpoint(serverUrl, 'mcp/reputation');

    const handleReputationItemKeyChange = (key: string) => {
        setReputationItemKey(key);
    };

    const clearResults = () => {
        setHttpRequest(null);
    };

    return (
        <Page
            title="Reputation MCP Service"
            subtitle="Manage reputation items and reviews about others"
        >
            {/* Service Information */}
            <Card className="mb-6">
                <CardBody>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
                            <StarIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">Reputation MCP Service</h3>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                        <LabelValue label="Endpoint" value={mcpEndpoint} />
                        <p>
                            <strong>Available Tools:</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li><strong>update:</strong> Create or update a reputation item about someone</li>
                            <li><strong>read:</strong> Retrieve a reputation item by key</li>
                            <li><strong>list-by-reporter:</strong> List all reputation items that I have reported</li>
                            <li><strong>list-by-subject:</strong> List all reputation items about a specific subject</li>
                            <li><strong>delete:</strong> Delete a reputation item by key</li>
                        </ul>
                        <p>
                            <strong>Data Format:</strong> Reputation items contain a unique key, subject DID, kind (review/rating/recommendation), and reputation data (JSON object with rating, comment, etc.).
                        </p>
                    </div>
                </CardBody>
            </Card>

            {/* Reputation Item Key */}
            <ReputationItemKey 
                reputationItemKey={reputationItemKey}
                onReputationItemKeyChange={handleReputationItemKeyChange}
            />

            <div className="grid gap-6 lg:grid-cols-5 items-start">
                {/* Left Column - Create/Update */}
                <div className="flex flex-col gap-6 lg:col-span-3">
                    <UpdateReputationItem 
                        reputationItemKey={reputationItemKey}
                        onSubmitHttpRequest={setHttpRequest} 
                    />
                </div>

                {/* Right Column - Reputation Operations */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                    {/* List My Reputations */}
                    <ListByReporter onSubmitHttpRequest={setHttpRequest} />

                    {/* List Reputations About Subject */}
                    <ListBySubject onSubmitHttpRequest={setHttpRequest} />

                    {/* Read Reputation Item */}
                    <ReadReputationItem 
                        reputationItemKey={reputationItemKey}
                        onSubmitHttpRequest={setHttpRequest}
                    />

                    {/* Delete Reputation Item */}
                    <DeleteReputationItem 
                        reputationItemKey={reputationItemKey}
                        onSubmitHttpRequest={setHttpRequest} 
                    />
                </div>
            </div>

            {/* JsonRpcDebug Component */}
            {httpRequest && (
                <div className="mt-6">
                    <JsonRpcDebug
                        url={mcpEndpoint}
                        httpRequest={httpRequest}
                        onClose={clearResults}
                    />
                </div>
            )}
        </Page>
    );
};

export default McpReputationPage;