import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components';
import { PlusIcon } from '@heroicons/react/24/outline';

export interface EditableTableProps {
    placeholders?: string[];
    columns: EditableTableColumn[];
    values?: string[][];
    onUpdate?: (values: string[][]) => void;
}

export const EditableTable = ({ columns, values = [], onUpdate }: EditableTableProps) => {
    const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    
    // Focus the input after it's rendered
    useEffect(() => {
        if (editingCell && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingCell]);

    const updateCellValue = (rowIndex: number, colIndex: number, newValue: string) => {
        if (onUpdate) {
            const newValues = [...values];
            // Ensure the row is an array
            if (!Array.isArray(newValues[rowIndex])) {
                newValues[rowIndex] = new Array(columns.length).fill('');
            }
            newValues[rowIndex][colIndex] = newValue;
            onUpdate(newValues);
        }
    };

    const handleCellClick = (rowIndex: number, colIndex: number, event: React.MouseEvent) => {
        // Don't set editing cell if it's already being edited
        if (editingCell?.row === rowIndex && editingCell?.col === colIndex) {
            return;
        }
        
        // Don't set editing cell if clicking on an input element
        if (event.target instanceof HTMLInputElement) {
            return;
        }
        
        setEditingCell({ row: rowIndex, col: colIndex });
    };

    const handleCellExit = () => {
        setEditingCell(null);
    };

    const addRow = () => {
        if (onUpdate) {
            const newRow = new Array(columns.length).fill('');
            onUpdate([...values, newRow]);
        }
    };

    const deleteRow = (rowIndex: number) => {
        if (onUpdate) {
            const newValues = values.filter((_, index) => index !== rowIndex);
            onUpdate(newValues);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">
                                {column.header}
                            </th>
                        ))}
                        <th className="px-2 py-2 w-12">
                            {/* Empty header for delete column - no border */}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {values.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length + 1} className="text-center py-8 text-gray-500 italic">
                                No data yet. Click "Add Row" to get started.
                            </td>
                        </tr>
                    ) : (
                        values.map((row, rowIndex) => {
                            // Ensure row is an array
                            const rowArray = Array.isArray(row) ? row : [];
                            return (
                            <tr key={rowIndex} className="group">
                                {columns.map((column, colIndex) => (
                                    <td 
                                        key={colIndex} 
                                        className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-50"
                                        onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
                                    >
                                        {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                                            column.renderEditCell(
                                                rowArray[colIndex] || '', 
                                                (newValue) => updateCellValue(rowIndex, colIndex, newValue),
                                                handleCellExit,
                                                inputRef
                                            )
                                        ) : (
                                            column.renderCell ? 
                                                column.renderCell(rowArray[colIndex] || '') : 
                                                (rowArray[colIndex] || '')
                                        )}
                                    </td>
                                ))}
                                <td className="px-2 py-2 w-12">
                                    <button
                                        onClick={() => deleteRow(rowIndex)}
                                        className="opacity-30 group-hover:opacity-100 transition-opacity duration-200 p-1 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                                        title="Delete row"
                                    >
                                        <svg 
                                            className="w-4 h-4" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                strokeWidth={2} 
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                                            />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            <div className="mt-4 flex justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addRow}
                    className="flex items-center gap-2"
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Row
                </Button>
            </div>
        </div>
    );
};

interface EditableTableColumn {
    header: string;
    renderCell?: (value: string) => React.ReactNode;
    renderEditCell: (
        value: string, 
        onChange: (value: string) => void,
        onExit: () => void,
        ref?: React.RefObject<HTMLInputElement | null>
    ) => React.ReactNode;
}

export function EditableTextColumn(header: string, inputType: 'text' | 'email' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local' = 'text'): EditableTableColumn {
    return {
        header,
        renderCell: (value: string) => (
            <span className="text-gray-900">{value || <span className="text-gray-400 italic">Click to edit</span>}</span>
        ),
        renderEditCell: (value: string, onChange: (value: string) => void, onExit: () => void, ref?: React.RefObject<HTMLInputElement | null>) => (
            <input
                ref={ref}
                type={inputType}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onExit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') onExit();
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full border-none outline-none bg-transparent"
            />
        )
    };
}

export function EditableNumberColumn(header: string): EditableTableColumn {
    return {
        header,
        renderCell: (value: string) => {
            const numValue = parseFloat(value);
            const displayValue = isNaN(numValue) ? '' : numValue.toLocaleString();
            return (
                <span className="text-gray-900 text-right font-mono">
                    {displayValue || <span className="text-gray-400 italic">Click to edit</span>}
                </span>
            );
        },
        renderEditCell: (value: string, onChange: (value: string) => void, onExit: () => void, ref?: React.RefObject<HTMLInputElement | null>) => (
            <input
                ref={ref}
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onExit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') onExit();
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full border-none outline-none bg-transparent text-right font-mono"
            />
        )
    };
}

export function EditableCurrencyColumn(header: string, currency: string = 'USD'): EditableTableColumn {
    const formatCurrency = (value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return '';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numValue);
    };

    return {
        header,
        renderCell: (value: string) => {
            const displayValue = formatCurrency(value);
            return (
                <span className="text-gray-900 text-right font-mono">
                    {displayValue || <span className="text-gray-400 italic">Click to edit</span>}
                </span>
            );
        },
        renderEditCell: (value: string, onChange: (value: string) => void, onExit: () => void, ref?: React.RefObject<HTMLInputElement | null>) => (
            <input
                ref={ref}
                type="number"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onExit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') onExit();
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                placeholder="1000000"
                className="w-full border-none outline-none bg-transparent text-right font-mono"
            />
        )
    };
}
