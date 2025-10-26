import { Button } from '@/components';
import { CardTitleAndBody } from '@/components/Card';
import { pruneVentureWorksheet, summarizeVentureWorksheet } from '@/stores/venture-utils';
import { type VentureWorksheet } from '@/stores/venture-types';
import { generateMarkdownSummary } from './markdown-generator';
import { useEffect, useState } from 'react';

interface ShowMarkdownProps {
    ventureWorksheet: VentureWorksheet;
    collapsed?: boolean;
}

const ShowMarkdown = ({ ventureWorksheet, collapsed = false}: ShowMarkdownProps) => {
    const [markdown, setMarkdown] = useState('');

    useEffect(()=>{
        const pruned = pruneVentureWorksheet(ventureWorksheet); // remove empty values and blank lines
        const markdown = generateMarkdownSummary(summarizeVentureWorksheet(pruned));
        setMarkdown(markdown);
    },[ventureWorksheet])

    const handleCopyMarkdown = () => {
        navigator.clipboard.writeText(markdown);
    };

    return (
        <CardTitleAndBody title="Markdown Summary" collapsed={collapsed} variant="success">
            <div className="flex justify-between">
                <p className="mb-4">
                    Below is a <a href="https://legalengineer.substack.com/p/markdown-the-secret-language-of-ai" target="_blank">markdown</a> summary of your venture idea.  Copy this markdown and use with your favorite
                    generative AI tool like <a href="https://chatgpt.com/" target="_blank">ChatGPT</a> or <a href="https://gemini.google.com/" target="_blank">Gemini</a>.
                </p>
                <Button
                    onClick={handleCopyMarkdown}
                    variant="primary"
                    size="sm"
                >
                    Copy Markdown
                </Button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
                <pre className="whitespace-pre-wrap text-sm font-mono overflow-x-auto">
                    {markdown}
                </pre>
            </div>
        </CardTitleAndBody>
    );
};

export default ShowMarkdown;
