import { useSearchParams } from 'react-router-dom';
import { Card, CardBody, CardTitleAndBody } from '@/components/Card';
import { Button } from '@/components';
import { useVentureStore } from '@/stores';
import { summarizeVentureWorksheet } from '@/stores/venture-utils';
import { b64u } from '@agentic-profile/auth';
import type { VentureWorksheet } from '@/stores/venture-types';


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

function doExport( shareUrl: string, worksheet: VentureWorksheet) {
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
}

export function ShareVentureWorksheet() {
    const { shareUrl, shareHost } = useShareParams();
    const { getVentureWorksheet } = useVentureStore();
    
    // Only show the card if exportUrl parameter exists
    if (!shareUrl)
        return null;
    
    const handleExport = () => {
        const worksheet = getVentureWorksheet();
        doExport(shareUrl, worksheet);
    };
    
    return (
        <div className={CENTER_MARGIN_CLASSES}>
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 shadow-lg">
                <CardBody>
                    <div className="space-y-4">
                        <h3>
                            NEXT: Share this Worksheet with {shareHost} to Activate the Venture Agent
                        </h3>
                        <p className="text-sm">
                            Sharing this venture worksheet data with {shareHost} will save
                            it for the Venture Agent to use.  Whenever the Venture Agent finds a possible match
                            it will use this information 
                        </p>
                        <div className="flex justify-center">
                            <button
                                onClick={handleExport}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium shadow-md hover:shadow-lg"
                            >
                                Activate Venture Agent on {shareHost}
                            </button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

const CENTER_MARGIN_CLASSES = "md:m-8 lg:m-16 md:!my-16 lg:!my-16";

interface ShareTarget {
    name: string;
    url?: string;
    description: string;
    details: string[];
}

export function QuickShare() {
    const { shareUrl } = useShareParams();

    const targets: ShareTarget[] = [
        { 
            name: 'Matchwise', 
            url: import.meta.env.VITE_MATCHWISE_SHARE_URL ?? 'https://matchwise.ai/import/agent',
            description: 'Matchwise hosts your identity on the Agentic Web',
            details: [
                'Instantly creates your unique identity',
                'Makes it easy to add agents that will work for you'
            ]
        },
        { 
            name: 'Lifepass',
            description: 'Lifepass uses agents to help you lead a happier healthier life',
            details: [
                'Every morning, Lifepass will suggest new activities and habits to help you lead a happier healthier life'
            ]
        },
];

    return (
        <CardTitleAndBody
            title="Featured Quick Shares"
            collapsed={!!shareUrl}
            className={!!shareUrl ? '' :CENTER_MARGIN_CLASSES}
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {targets.map((t, idx) => (
                    <ShareCard key={idx} target={t} />
                ))}
            </div>
        </CardTitleAndBody>
    );
}

function ShareCard({ target }: { target: ShareTarget }) {
    const { getVentureWorksheet } = useVentureStore();
    const { name, url, description, details } = target;
    const isAvailable = !!url;

    const handleShare = () => {
        if(!url)
            return;

        const worksheet = getVentureWorksheet();
        doExport(url, worksheet);
    };

    return (
        <CardTitleAndBody title={name} variant="default">
            <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-800 dark:text-gray-200">
                    {details.map((line, idx) => (
                        <li key={idx}>{line}</li>
                    ))}
                </ul>
                <div>
                    <Button
                        onClick={handleShare}
                        disabled={!isAvailable}
                    >
                        {isAvailable ? `Share with ${name}` : `Coming Soon`}
                    </Button>
                </div>
            </div>
        </CardTitleAndBody>
    )
}
