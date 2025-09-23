import { McpToolCallCard } from '@/components';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { type HttpRequest } from '@/components/JsonRpcDebug';

interface McpWalletToolsProps {
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const McpWalletTools = ({ onSubmitHttpRequest }: McpWalletToolsProps) => {
    const createMcpRequest = () => ({
        method: "tools/list",
        params: {}
    });

    return (
        <McpToolCallCard
            title="MCP Wallet Tools"
            icon={<WrenchScrewdriverIcon className="w-5 h-5 text-white" />}
            description="View the available MCP tools for the wallet service, including their descriptions and input schemas."
            buttonText="List MCP Wallet Tools"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        />
    );
};

export default McpWalletTools;
