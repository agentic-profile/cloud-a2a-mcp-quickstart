import { useSearchParams } from 'react-router-dom';
import { Card, CardBody } from '@/components/Card';
import { useVentureStore } from '@/stores';
import { summarizeVentureWorksheet } from '@/stores/venture-utils';
import { b64u } from '@agentic-profile/auth';


interface ShareParams {
    shareUrl: string | null;
    shareHost: string | null;
}

export function useShareParams(): ShareParams {
    const [searchParams] = useSearchParams();
    const shareUrl = searchParams.get('shareUrl');
    if (!shareUrl) {
        return { shareUrl: null, shareHost: null };
    }

    try {
        let shareHost = new URL(shareUrl).hostname;
        shareHost = shareHost.charAt(0).toUpperCase() + shareHost.slice(1);
        return { shareUrl, shareHost };
    } catch (error) {
        console.error('Error parsing share URL:', error);
        return { shareUrl: null, shareHost: null };
    }
}

const ShareVentureWorksheet = () => {
    const { shareUrl, shareHost } = useShareParams();
    const { getVentureWorksheet } = useVentureStore();
    
    // Only show the card if exportUrl parameter exists
    if (!shareUrl)
        return null;
    
    const handleExport = () => {
        const worksheet = getVentureWorksheet();
        const summary = summarizeVentureWorksheet(worksheet);
        const host = import.meta.env.VITE_API_URL ?? 'https://example-api.agenticprofile.ai';
        console.log( 'MCP host', host );
        const b64uPayload = b64u.objectToBase64Url({
            type: 'agent',
            context: summary,
            mcp: `${host}/mcp/venture`
        });
        
        // Create the URL with the payload parameter
        const url = new URL(shareUrl);
        url.searchParams.set('payload', b64uPayload);
        
        // Navigate to the return URL
        window.location.href = url.toString();
    };
    
    return (
        <div className="mx-16 py-16">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 shadow-lg">
                <CardBody>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                            NEXT: Share Worksheet Back to {shareHost}
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Make the venture worksheet data available to {shareHost} and
                            continue back to that website.
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={handleExport}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium shadow-md hover:shadow-lg"
                            >
                                Continue to {shareHost}
                            </button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default ShareVentureWorksheet;
