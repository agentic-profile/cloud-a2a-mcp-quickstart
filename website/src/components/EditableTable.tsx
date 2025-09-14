import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';

export interface EditableTableProps {
    placeholders?: string[];
    columns: EditableTableColumn[];
    values?: string[][];
    onUpdate?: (values: string[][]) => void;
}

export const EditableTable = ({ columns, values = [], onUpdate }: EditableTableProps) => {
    const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    
    // Add a blank row if the values array is empty
    useEffect(() => {
        if (values.length === 0 && onUpdate) {
            onUpdate([new Array(columns.length).fill('')]);
        }
    }, [values.length, columns.length, onUpdate]);
    
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
            const newRowIndex = values.length;
            onUpdate([...values, newRow]);
            // Set the first cell of the new row as the editing cell
            setEditingCell({ row: newRowIndex, col: 0 });
        }
    };

    const deleteRow = (rowIndex: number) => {
        if (onUpdate && values.length > 1) {
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
                    {values.map((row, rowIndex) => {
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
                                {values.length > 1 && (
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
                                )}
                            </td>
                        </tr>
                        );
                    })}
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
                    {displayValue || <span className="text-gray-400 italic font-sans">Click to edit</span>}
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
                className="w-full border-none outline-none bg-transparent text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                    {displayValue || <span className="text-gray-400 italic font-sans">Click to edit</span>}
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
                className="w-full border-none outline-none bg-transparent text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
        )
    };
}

export interface SelectOption {
    key: string;
    label: string;
}

export function EditableSelectColumn(header: string, options: SelectOption[]): EditableTableColumn {
    return {
        header,
        renderCell: (value: string) => {
            const selectedOption = options.find(option => option.key === value);
            const displayValue = selectedOption ? selectedOption.label : value;
            return (
                <span className="text-gray-900">
                    {displayValue || <span className="text-gray-400 italic">Click to edit</span>}
                </span>
            );
        },
        renderEditCell: (value: string, onChange: (value: string) => void, onExit: () => void, ref?: React.RefObject<HTMLInputElement | null>) => (
            <select
                ref={ref as React.RefObject<HTMLSelectElement>}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onExit}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') onExit();
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full border-none outline-none bg-transparent cursor-pointer"
            >
                <option value="">Select an option...</option>
                {options.map((option) => (
                    <option key={option.key} value={option.key}>
                        {option.label}
                    </option>
                ))}
            </select>
        )
    };
}

export function EditableUrlColumn(header: string): EditableTableColumn {
    const isValidUrl = (url: string): boolean => {
        if (!url.trim()) return true; // Empty URLs are valid
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const formatUrlForDisplay = (url: string): string => {
        if (!url.trim()) return '';
        try {
            const urlObj = new URL(url);
            // Show domain + path, truncate if too long
            const displayUrl = urlObj.hostname + urlObj.pathname;
            return displayUrl.length > 50 ? displayUrl.substring(0, 47) + '...' : displayUrl;
        } catch {
            return url.length > 50 ? url.substring(0, 47) + '...' : url;
        }
    };

    return {
        header,
        renderCell: (value: string) => {
            if (!value.trim()) {
                return (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400 italic">Click to edit</span>
                        <PencilIcon className="w-4 h-4 text-gray-400" />
                    </div>
                );
            }
            
            const isValid = isValidUrl(value);
            const displayText = formatUrlForDisplay(value);
            
            return (
                <div className="flex items-center justify-between">
                    <a
                        href={isValid ? value : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-blue-600 hover:text-blue-800 hover:underline flex-1 ${
                            !isValid ? 'text-red-500 hover:text-red-700' : ''
                        }`}
                        onClick={(e) => {
                            if (!isValid) {
                                e.preventDefault();
                            }
                        }}
                        title={value}
                    >
                        {displayText}
                    </a>
                    <PencilIcon className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                </div>
            );
        },
        renderEditCell: (value: string, onChange: (value: string) => void, onExit: () => void, ref?: React.RefObject<HTMLInputElement | null>) => {
            const isValid = isValidUrl(value);
            
            return (
                <div className="w-full">
                    <input
                        ref={ref}
                        type="url"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onExit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === 'Escape') onExit();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        placeholder="https://example.com"
                        className={`w-full border-none outline-none bg-transparent ${
                            value.trim() && !isValid ? 'text-red-500' : ''
                        }`}
                    />
                    {value.trim() && !isValid && (
                        <div className="text-xs text-red-500 mt-1">
                            Invalid URL format
                        </div>
                    )}
                </div>
            );
        }
    };
}
