import { useState, useRef } from 'react';
import { type AttributedString, type CellTable, type VentureWorksheet } from '@/stores/venture-types';

interface ImportVentureJsonProps {
    onImport: (data: VentureWorksheet) => void;
}

/*
interface VentureData {
    problem?: string[];
    solution?: string[];
    team?: (string | number)[][];
    positioning?: Array<{ id: string; values: string[]; selected: number }>;
    marketOpportunity?: (string | number)[][];
    milestones?: (string | number)[][];
    references?: (string | number)[][];
}*/

const ImportVentureJson = ({ onImport }: ImportVentureJsonProps) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (!file.type.includes('json') && !file.name.endsWith('.json')) {
            setError('Please select a valid JSON file.');
            return;
        }

        setIsImporting(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                console.log('Raw JSON content:', content);
                const data = JSON.parse(content);
                console.log('Parsed JSON data:', data);
                
                // Validate that the JSON contains expected venture data structure
                if (!data || typeof data !== 'object') {
                    throw new Error('Invalid JSON structure');
                }

                const worksheet = asWorksheet(data);

                //console.log('About to import data:', data);
                onImport(worksheet);
                setIsImporting(false);
            } catch (err) {
                console.error('JSON parsing error:', err);
                setError('Failed to parse JSON file. Please ensure it contains valid venture data.');
                setIsImporting(false);
            }
        };
        
        reader.onerror = () => {
            setError('Failed to read file. Please try again.');
            setIsImporting(false);
        };
        
        reader.readAsText(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="space-y-4">
            <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
                    isDragOver
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                } ${isImporting ? 'opacity-50 pointer-events-none' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <div className="space-y-3">
                    <div className="text-4xl">📁</div>
                    <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {isImporting ? 'Importing...' : 'Drop your venture JSON file here'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            or click to browse files
                        </p>
                    </div>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileInput}
                className="hidden"
            />

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
                </div>
            )}

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p><strong>Expected JSON structure:</strong></p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-x-auto">
{`{
  "problem": ["Problem 1", "Problem 2"],
  "solution": ["Solution 1", "Solution 2"],
  "positioning": [
    {"id": "forWho", "values": ["Target 1", "Target 2"], "selected": 0},
    {"id": "whoNeed", "values": ["Need 1", "Need 2"], "selected": 1},
    {"id": "name", "values": ["Company Name"], "selected": 0},
    {"id": "productCategory", "values": ["Category 1", "Category 2"], "selected": 0},
    {"id": "keyBenefit", "values": ["Benefit 1"], "selected": 0},
    {"id": "unlike", "values": ["Competitor 1", "Competitor 2"], "selected": 1},
    {"id": "primaryDifferentiator", "values": ["Diff 1"], "selected": 0}
  ],
  "marketOpportunity": [["Segment", 1000000]],
  "milestones": [["Milestone", 12, 50000]],
  "team": [["Name", "LinkedIn", "full"]],
  "references": [["URL", "Description"]]
}`}
                </pre>
            </div>
        </div>
    );
};

export default ImportVentureJson;

function asWorksheet(data: any): VentureWorksheet {

    // Convert string[] to AttributedString[]
    const ensureAttributedStrings = (arr: (AttributedString | string)[] | undefined): AttributedString[] => {
        if (!arr || !Array.isArray(arr)) return [];
        return arr.map(e => typeof e === 'string' ? { text: e } : e);
    };

    // Convert StringOrNumberTable to CellTable
    const ensureCellTable = (table: CellTable | (string | number)[][] | undefined): CellTable => {
        if( !table )
            return { values: [] };

        if( typeof table === 'object' && 'values' in table )
            return table as CellTable;

        if ( Array.isArray(table)) 
            return { values: table };

        console.error(`ensureCellTable() found unknown table type ${typeof table}: ${table}`);
        return { values: [] };
    };

    // Convert SimplifiedPositioning to Positioning
    const ensurePositioning = (simplified: any): { id: string; values: string[]; selected: number }[] => {
        // If it's already in array format (Positioning), return as-is
        if (Array.isArray(simplified)) {
            return simplified;
        }
        
        // If it's a SimplifiedPositioning object, convert to Positioning array
        if (simplified && typeof simplified === 'object') {
            const positioningKeys = [
                'forWho', 'whoNeed', 'name', 'productCategory', 
                'keyBenefit', 'unlike', 'primaryDifferentiator'
            ];
            
            return positioningKeys
                .filter(key => simplified[key] !== undefined)
                .map(key => ({
                    id: key,
                    values: [simplified[key]],
                    selected: 0
                }));
        }
        
        // Return empty positioning array
        console.error(`toPositioning() found unknown positioning type ${typeof simplified}: ${simplified}`);
        return [];
    };

    const worksheet = {
        problem: ensureAttributedStrings(data.problem),
        solution: ensureAttributedStrings(data.solution),
        positioning: ensurePositioning(data.positioning),
        marketOpportunity: ensureCellTable(data.marketOpportunity),
        milestones: ensureCellTable(data.milestones),
        team: ensureCellTable(data.team),
        references: ensureCellTable(data.references),
    } as VentureWorksheet;

    return worksheet;
}
