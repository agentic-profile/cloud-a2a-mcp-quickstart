import McpToolCallCard from '@/components/McpToolCallCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { type HttpRequest } from '@/components/JsonRpcDebug';

interface QueryLocationProps {
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const QueryLocation: React.FC<QueryLocationProps> = ({ onSubmitHttpRequest }) => {
    const createMcpRequest = () => ({
        method: "tools/call",
        params: {
            name: "query",
        }
    });

    return (
        <McpToolCallCard
            title="Query Location"
            icon={<MagnifyingGlassIcon className="w-5 h-5 text-white" />}
            description="Click the button below to query the current location data."
            buttonText="Query Location"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        />
    );
};

export default QueryLocation;
