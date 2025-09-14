interface ShareVentureJsonProps {
    values: Record<string, any>;
}

function resolveName(positioning: Record<string, any> | undefined) {
    const { selected, values } = positioning?.find((p: { id: string; values: string[] }) => p.id === 'name');
    return values?.[selected ?? 0] ?? 'Your Venture';
}

const ShareVentureJson = ({ values }: ShareVentureJsonProps) => {
    const jsonString = JSON.stringify(values, null, 4);

    const name = resolveName(values.positioning);
    
    const handleShareJson = () => {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(`
                <html>
                    <head>
                        <title>${name} - JSON</title>
                        <style>
                            body { 
                                font-family: 'Courier New', monospace; 
                                padding: 20px; 
                                background-color: #f5f5f5;
                                margin: 0;
                            }
                            pre { 
                                background-color: white; 
                                padding: 20px; 
                                border-radius: 8px; 
                                border: 1px solid #ddd;
                                overflow-x: auto;
                                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                            }
                            h1 { 
                                color: #333; 
                                margin-bottom: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>${name}</h1>
                        <pre>${jsonString}</pre>
                    </body>
                </html>
            `);
            newWindow.document.close();
        }
    };

    const handleDownloadJson = () => {
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${name.toLowerCase().replace(/\s+/g, '-')}-venture.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={handleShareJson}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
                View JSON
            </button>
            <button
                onClick={handleDownloadJson}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
                Download JSON
            </button>
        </div>
    );
};

export default ShareVentureJson;
