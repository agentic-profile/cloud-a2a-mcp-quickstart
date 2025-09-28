import { useState } from 'react';
import { Button } from '@/components';
import { CardTitleAndBody, Card, CardHeader, CardBody } from '@/components/Card';
import ShareJson from './ShareJson';
import ArchiveVenture from './ArchiveVenture';
import { MarkdownGenerator } from './MarkdownGenerator';
import { useVentureStore, pruneVentureData, simplifyVentureData } from '@/stores/ventureStore';

const AdvancedFeatures = () => {
    const [showMarkdown, setShowMarkdown] = useState(false);

    const {
        setVentureData,
        clearVentureData,
        getVentureData
    } = useVentureStore();

    const ventureData = pruneVentureData(getVentureData()); // remove empty values and blank lines

    // Generate Markdown summary using the MarkdownGenerator
    const generateMarkdownSummary = () => {
        return MarkdownGenerator.generateMarkdownSummary(simplifyVentureData(ventureData));
    };

    return (
        <>
            <CardTitleAndBody title="Advanced Features" collapsible={true}>
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setShowMarkdown(true)}
                            variant="success"
                        >
                            Show Markdown
                        </Button>
                        <Button
                            onClick={clearVentureData}
                            variant="danger"
                        >
                            Clear All Data
                        </Button>
                    </div>
                    <ShareJson
                        values={ventureData}
                        onDataImported={setVentureData}
                    />
                    <ArchiveVenture />
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

        </>
    );
};

export default AdvancedFeatures;
