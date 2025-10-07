export function resolveName(positioning: Record<string, any> | undefined) {
    if( !positioning )
        return 'Your Venture';
    if( typeof positioning === 'object' && 'name' in positioning )
        return positioning.name;
    if( !Array.isArray(positioning) )
        return "Your Venture";  // unexpected type

    const nameTab = positioning?.find((p: { id: string; values: string[] }) => p.id === 'name');
    if (!nameTab) return 'Your Venture';
    
    const { selected, values } = nameTab;
    return values?.[selected ?? 0] ?? 'Your Venture';
}

export function viewJsonInWindow(values: Record<string, any>) {
    console.log('viewJsonInWindow', JSON.stringify(values, null, 4));
    const jsonString = JSON.stringify(values, null, 4);
    const name = resolveName(values.positioning);
    
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
}

export function downloadJson(values: Record<string, any>) {
    const jsonString = JSON.stringify(values, null, 4);
    const name = resolveName(values.positioning);
    
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name.toLowerCase().replace(/\s+/g, '-')}-venture.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Hook for using export functions
export const useExportFunctions = (values: Record<string, any>) => {
    return {
        viewJson: () => viewJsonInWindow(values),
        exportJson: () => downloadJson(values)
    };
};
