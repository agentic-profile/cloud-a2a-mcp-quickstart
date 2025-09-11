import React, { useState } from 'react';

export interface EditableTableProps {
    placeholders?: string[];
    columns: EditableTableColumn[];
    values?: string[][];
    onUpdate?: (values: string[][]) => void;
}

export const EditableTable = ({ columns, values = [], onUpdate }: EditableTableProps) => {
    const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
    const [editValue, setEditValue] = useState('');

    const handleCellClick = (rowIndex: number, colIndex: number, currentValue: string) => {
        setEditingCell({ row: rowIndex, col: colIndex });
        setEditValue(currentValue);
    };

    const handleCellSave = () => {
        if (editingCell && onUpdate) {
            const newValues = [...values];
            newValues[editingCell.row][editingCell.col] = editValue;
            onUpdate(newValues);
        }
        setEditingCell(null);
        setEditValue('');
    };

    const handleCellCancel = () => {
        setEditingCell(null);
        setEditValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCellSave();
        } else if (e.key === 'Escape') {
            handleCellCancel();
        }
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
                    {values.map((row, rowIndex) => (
                        <tr key={rowIndex} className="group">
                            {columns.map((column, colIndex) => (
                                <td 
                                    key={colIndex} 
                                    className="border border-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleCellClick(rowIndex, colIndex, row[colIndex] || '')}
                                >
                                    {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                                        <input
                                            type={column.inputType || 'text'}
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onBlur={handleCellSave}
                                            onKeyDown={handleKeyDown}
                                            className="w-full border-none outline-none bg-transparent"
                                            min={column.min}
                                            max={column.max}
                                            step={column.step}
                                            autoFocus
                                        />
                                    ) : (
                                        column.renderCell ? 
                                            column.renderCell(row[colIndex] || '', rowIndex, colIndex) : 
                                            (row[colIndex] || '')
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
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-end">
                <button
                    onClick={addRow}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
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
                            d="M12 4v16m8-8H4" 
                        />
                    </svg>
                    Add Row
                </button>
            </div>
        </div>
    );
};

interface EditableTableColumn {
    header: string;
    inputType?: 'text' | 'email' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local';
    min?: number;
    max?: number;
    step?: number;
    renderCell?: (value: string, rowIndex: number, colIndex: number) => React.ReactNode;
}

export function EditableTextColumn(header: string, inputType: 'text' | 'email' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local' = 'text'): EditableTableColumn {
    return {
        header,
        inputType,
        renderCell: (value: string) => (
            <span className="text-gray-900">{value || <span className="text-gray-400 italic">Click to edit</span>}</span>
        )
    };
}

export function EditableNumberColumn(header: string, min?: number, max?: number, step?: number): EditableTableColumn {
    return {
        header,
        inputType: 'number',
        min,
        max,
        step,
        renderCell: (value: string) => {
            const numValue = parseFloat(value);
            const displayValue = isNaN(numValue) ? '' : numValue.toLocaleString();
            return (
                <span className="text-gray-900 text-right font-mono">
                    {displayValue || <span className="text-gray-400 italic">Click to edit</span>}
                </span>
            );
        }
    };
}