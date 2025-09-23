import { useState } from 'react';
import { McpToolCallCard } from '@/components';
import { UsersIcon } from '@heroicons/react/24/outline';
import { type HttpRequest } from '@/components/JsonRpcDebug';

interface ListBySubjectProps {
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const ListBySubject = ({ onSubmitHttpRequest }: ListBySubjectProps) => {
    const [subjectDid, setSubjectDid] = useState<string>('did:example:subject123');

    const createMcpRequest = () => ({
        method: "tools/call",
        params: {
            name: "list-by-subject",
            subjectDid: subjectDid
        }
    });

    return (
        <McpToolCallCard
            title="List Reputations About Subject"
            icon={<UsersIcon className="w-5 h-5 text-white" />}
            description="List all reputation items about a specific subject."
            buttonText="List Reputations About Subject"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        >
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
                <p className="text-xs text-gray-500 mt-1">DID of the person to get reputation items for</p>
            </div>
        </McpToolCallCard>
    );
};

export default ListBySubject;
