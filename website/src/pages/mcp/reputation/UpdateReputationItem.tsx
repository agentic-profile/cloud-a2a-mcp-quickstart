import { useState } from 'react';
import { McpToolCallCard, Button, LabelValue } from '@/components';
import { PlusIcon } from '@heroicons/react/24/outline';
import { type HttpRequest } from '@/components/JsonRpcDebug';

interface UpdateReputationItemProps {
    reputationItemKey: string;
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const UpdateReputationItem = ({ reputationItemKey, onSubmitHttpRequest }: UpdateReputationItemProps) => {
    const [subjectDid, setSubjectDid] = useState<string>('did:example:subject123');
    const [kind, setKind] = useState<string>('review');
    const [reputationData, setReputationData] = useState<string>('{\n  "rating": 5,\n  "comment": "Excellent service and professionalism",\n  "category": "service_quality"\n}');

    const handleExampleClick = (exampleData: any) => {
        setReputationData(JSON.stringify(exampleData, null, 2));
    };

    const createMcpRequest = () => {
        let parsedReputation;
        try {
            parsedReputation = JSON.parse(reputationData);
        } catch (error) {
            alert('Invalid JSON in reputation data');
            throw error;
        }

        return {
            method: "tools/call",
            params: {
                name: "update",
                key: reputationItemKey,
                subjectDid: subjectDid,
                kind: kind,
                reputation: parsedReputation
            }
        };
    };

    return (
        <McpToolCallCard
            title="Create/Update Reputation Item"
            icon={<PlusIcon className="w-5 h-5 text-white" />}
            description="Create or update a reputation item about someone"
            buttonText="Create/Update Reputation"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        >
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                <LabelValue label="Using reputation key" value={reputationItemKey} />
                <p className="sm">This key is managed by the Reputation Item Key card above</p>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="subjectDid" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subject DID
                    </label>
                    <input
                        id="subjectDid"
                        type="text"
                        value={subjectDid}
                        onChange={(e) => setSubjectDid(e.target.value)}
                        placeholder="did:example:subject123"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">DID of the person this reputation is about</p>
                </div>

                <div>
                    <label htmlFor="kind" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reputation Kind
                    </label>
                    <select
                        id="kind"
                        value={kind}
                        onChange={(e) => setKind(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    >
                        <option value="review">Review</option>
                        <option value="rating">Rating</option>
                        <option value="recommendation">Recommendation</option>
                        <option value="feedback">Feedback</option>
                        <option value="testimonial">Testimonial</option>
                        <option value="endorsement">Endorsement</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Type of reputation being created</p>
                </div>

                <div>
                    <div className="mb-3">
                        <p className="sm">Examples:</p>
                        <div className="flex flex-wrap gap-2">
                            {EXAMPLES.map((example, index) => (
                                <Button
                                    key={index}
                                    onClick={() => handleExampleClick(example.data)}
                                    variant="secondary"
                                    size="sm"
                                    className="text-xs"
                                >
                                    {example.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <label htmlFor="reputationData" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reputation Data (JSON)
                    </label>
                    <textarea
                        id="reputationData"
                        value={reputationData}
                        onChange={(e) => setReputationData(e.target.value)}
                        rows={8}
                        placeholder='{"rating": 5, "comment": "..."}'
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">JSON object containing the reputation data</p>
                </div>
            </div>
        </McpToolCallCard>
    );
};

export default UpdateReputationItem;

const EXAMPLES = [
    { 
        name: "Service Review",
        data: {
            rating: 5,
            comment: "Excellent service and professionalism. Highly recommended!",
            category: "service_quality",
            date: "2024-01-15",
            verified: true
        }
    },
    {
        name: "Product Rating",
        data: {
            rating: 4,
            comment: "Good product, fast delivery, minor issues with packaging",
            category: "product_quality",
            aspects: {
                quality: 4,
                delivery: 5,
                packaging: 3
            },
            would_recommend: true
        }
    },
    {
        name: "Professional Recommendation",
        data: {
            rating: 5,
            comment: "Outstanding professional with excellent communication skills",
            category: "professional",
            skills: ["communication", "problem_solving", "leadership"],
            experience_years: 3,
            project_outcome: "successful"
        }
    },
    {
        name: "Collaboration Feedback",
        data: {
            rating: 4,
            comment: "Great collaborator, very reliable and creative",
            category: "collaboration",
            strengths: ["reliability", "creativity", "teamwork"],
            areas_for_improvement: ["time_management"],
            overall_satisfaction: "high"
        }
    }
];
