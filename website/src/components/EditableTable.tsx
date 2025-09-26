import React, { useState, useRef, useEffect } from 'react';
import { Button, IconButton } from '@/components';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import type { StringOrNumberTable } from '@/stores/ventureStore';

// Common number handlers for reuse across number and currency columns
const renderNumberCell = (value: string | number, formatFunction?: (value: string | number) => string) => {
    // Special handling for zero values
    if (value === 0) {
        const displayValue = formatFunction ? formatFunction(0) : "0";
        return (
            <span className="text-gray-900 text-right font-mono">
                {displayValue}
            </span>
        );
    }
    
    const numValue = typeof value === 'number' ? value : parseFloat(String(value));
    const displayValue = isNaN(numValue) ? '' : (formatFunction ? formatFunction(numValue) : numValue.toLocaleString());
    return (
        <span className="text-gray-900 text-right font-mono">
            {displayValue !== '' ? displayValue : <span className="text-gray-400 italic font-sans">Click to edit</span>}
        </span>
    );
};

const renderNumberEditCell = (
    value: string | number, 
    onChange: (value: string | number) => void, 
    onExit: () => void, 
    ref?: React.RefObject<HTMLInputElement | null>,
    placeholder?: string
) => (
    <input
        ref={ref}
        type="number"
        value={value === 0 ? "0" : String(value)}
        onChange={(e) => {
            const inputValue = e.target.value;
            if (inputValue === '') {
                onChange('');
            } else if (inputValue === '0' || inputValue === '0.') {
                onChange(0);
            } else {
                const numValue = parseFloat(inputValue);
                if (!isNaN(numValue)) {
                    onChange(numValue);
                } else {
                    // Keep the string value if it's not a valid number
                    onChange(inputValue);
                }
            }
        }}
        onBlur={onExit}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'Escape') onExit();
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        placeholder={placeholder}
        className="w-full border-none outline-none bg-transparent text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
    />
);

const asNumberOrString = (value: string | number | undefined | null ): string | number => {
    if (value === undefined || value === null) return '';
    return value
};

const asString = (value: string | number | undefined | null ): string => {
    if( typeof value === 'string')
        return value;
    else if( typeof value === 'number')
        return String(value);
    else
    return '';
};

export interface EditableTableProps {
    placeholders?: string[];
    columns: EditableTableColumn[];
    values?: StringOrNumberTable;
    hiddenRows?: StringOrNumberTable;
    onUpdate?: (values: StringOrNumberTable, hiddenRows?: StringOrNumberTable) => void;
}

export const EditableTable = ({ columns, values = [], hiddenRows = [], onUpdate }: EditableTableProps) => {
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

    const updateCellValue = (rowIndex: number, colIndex: number, newValue: string | number) => {
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

    const hideRow = (rowIndex: number) => {
        if (onUpdate) {
            const rowToHide = values[rowIndex];
            const newValues = values.filter((_, index) => index !== rowIndex);
            const newHiddenRows = [...hiddenRows, rowToHide];
            onUpdate(newValues, newHiddenRows);
        }
    };

    const unhideRow = (rowIndex: number) => {
        if (onUpdate) {
            const rowToUnhide = hiddenRows[rowIndex];
            const newHiddenRows = hiddenRows.filter((_, index) => index !== rowIndex);
            const newValues = [...values, rowToUnhide];
            onUpdate(newValues, newHiddenRows);
        }
    };

    const deleteHiddenRow = (rowIndex: number) => {
        if (onUpdate) {
            const newHiddenRows = hiddenRows.filter((_, index) => index !== rowIndex);
            onUpdate(values, newHiddenRows);
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr>
                        <th className="px-2 py-2 w-12">
                            {/* Empty header for eye icon column - no border */}
                        </th>
                        {columns.map((column, index) => (
                            <th key={index} className="border border-gray-300 dark:border-gray-500 px-4 py-2 bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 text-left">
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
                            <td className="px-2 py-2 w-12">
                                <IconButton
                                    icon={<EyeSlashIcon />}
                                    onClick={() => hideRow(rowIndex)}
                                    title="Hide row"
                                />
                            </td>
                            {columns.map((column, colIndex) => (
                                <td 
                                    key={colIndex} 
                                    className="border border-gray-300 dark:border-gray-500 px-4 py-2 cursor-pointer hover:bg-gray-50"
                                    onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
                                >
                                    {editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
                                        column.renderEditCell(
                                            asNumberOrString(rowArray[colIndex]), 
                                            (newValue) => updateCellValue(rowIndex, colIndex, newValue),
                                            handleCellExit,
                                            inputRef
                                        )
                                    ) : (
                                        column.renderCell ? 
                                            column.renderCell(asNumberOrString(rowArray[colIndex])) : 
                                            asString(rowArray[colIndex])
                                    )}
                                </td>
                            ))}
                            <td className="px-2 py-2 w-12">
                                {values.length > 1 && (
                                    <IconButton
                                        icon={<TrashIcon />}
                                        onClick={() => deleteRow(rowIndex)}
                                        variant="danger"
                                        title="Delete row"
                                    />
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
                    className="flex items-center gap-2 focus:ring-0 focus:ring-offset-0 focus:outline-none focus:ring-transparent"
                    style={{ outline: 'none' }}
                >
                    <PlusIcon className="w-4 h-4" />
                    Add Row
                </Button>
            </div>
            
            {/* Hidden Rows Section */}
            {hiddenRows && hiddenRows.length > 0 && (
                <div className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                    <h4>Hidden Rows</h4>
                    <table className="mt-4 min-w-full border-collapse">
                         <thead>
                             <tr>
                                 <th className="px-2 py-2 w-12">
                                     {/* Empty header for eye icon column - no border */}
                                 </th>
                                 {columns.map((column, index) => (
                                     <th key={index} className="border border-gray-300 dark:border-gray-500 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-left">
                                         {column.header}
                                     </th>
                                 ))}
                                 <th className="pl-2 py-2 w-8">
                                     {/* Empty header for delete column - no border */}
                                 </th>
                             </tr>
                         </thead>
                        <tbody>
                            {hiddenRows.map((row, rowIndex) => {
                                // Ensure row is an array
                                const rowArray = Array.isArray(row) ? row : [];
                                return (
                                     <tr key={rowIndex} className="group">
                                         <td className="pl-2 py-2">
                                             <IconButton
                                                 icon={<EyeIcon />}
                                                 onClick={() => unhideRow(rowIndex)}
                                                 title="Show row"
                                             />
                                         </td>
                                         {columns.map((column, colIndex) => (
                                             <td 
                                                 key={colIndex} 
                                                 className="border border-gray-300 dark:border-gray-500 px-4 py-2 bg-white dark:bg-gray-900"
                                             >
                                                 {column.renderCell ? 
                                                     column.renderCell(asNumberOrString(rowArray[colIndex])) : 
                                                     asString(rowArray[colIndex])
                                                 }
                                             </td>
                                         ))}
                                         <td className="pl-2 py-2 w-8">
                                             <IconButton
                                                 icon={<TrashIcon />}
                                                 onClick={() => deleteHiddenRow(rowIndex)}
                                                 variant="danger"
                                                 title="Delete row permanently"
                                             />
                                         </td>
                                     </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

interface EditableTableColumn {
    header: string;
    renderCell?: (value: string | number) => React.ReactNode;
    renderEditCell: (
        value: string | number, 
        onChange: (value: string | number) => void,
        onExit: () => void,
        ref?: React.RefObject<HTMLInputElement | null>
    ) => React.ReactNode;
}

export function EditableTextColumn(header: string, inputType: 'text' | 'email' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local' = 'text'): EditableTableColumn {
    return {
        header,
        renderCell: (value: string | number) => (
            <span className="text-gray-900">{String(value) || <span className="text-gray-400 italic">Click to edit</span>}</span>
        ),
        renderEditCell: (value: string | number, onChange: (value: string | number) => void, onExit: () => void, ref?: React.RefObject<HTMLInputElement | null>) => (
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
        renderCell: (value: string | number) => renderNumberCell(value),
        renderEditCell: (value: string | number, onChange: (value: string | number) => void, onExit: () => void, ref?: React.RefObject<HTMLInputElement | null>) => 
            renderNumberEditCell(value, onChange, onExit, ref)
    };
}

export function EditableCurrencyColumn(header: string, currency: string = 'USD'): EditableTableColumn {
    const formatCurrency = (value: string | number) => {
        const numValue = typeof value === 'number' ? value : parseFloat(String(value));
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
        renderCell: (value: string | number) => renderNumberCell(value, formatCurrency),
        renderEditCell: (value: string | number, onChange: (value: string | number) => void, onExit: () => void, ref?: React.RefObject<HTMLInputElement | null>) => 
            renderNumberEditCell(value, onChange, onExit, ref, "$100,000")
    };
}

export interface SelectOption {
    key: string;
    label: string;
}

export function EditableSelectColumn(header: string, options: SelectOption[]): EditableTableColumn {
    return {
        header,
        renderCell: (value: string | number) => {
            const stringValue = String(value);
            const selectedOption = options.find(option => option.key === stringValue);
            const displayValue = selectedOption ? selectedOption.label : stringValue;
            return (
                <span className="text-gray-900">
                    {displayValue || <span className="text-gray-400 italic">Click to edit</span>}
                </span>
            );
        },
        renderEditCell: (value: string | number, onChange: (value: string | number) => void, onExit: () => void, ref?: React.RefObject<HTMLInputElement | null>) => (
            <select
                ref={ref as unknown as React.RefObject<HTMLSelectElement>}
                value={String(value)}
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
        renderCell: (value: string | number) => {
            const stringValue = String(value);
            if (!stringValue.trim()) {
                return (
                    <div className="flex items-center justify-between">
                        <span className="text-gray-400 italic">Click to edit</span>
                        <PencilIcon className="w-4 h-4 text-gray-400" />
                    </div>
                );
            }
            
            const isValid = isValidUrl(stringValue);
            const displayText = formatUrlForDisplay(stringValue);
            
            return (
                <div className="flex items-center justify-between">
                    <a
                        href={isValid ? stringValue : '#'}
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
                        title={stringValue}
                    >
                        {displayText}
                    </a>
                    <PencilIcon className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
                </div>
            );
        },
        renderEditCell: (value: string | number, onChange: (value: string | number) => void, onExit: () => void, ref?: React.RefObject<HTMLInputElement | null>) => {
            const stringValue = String(value);
            const isValid = isValidUrl(stringValue);
            
            return (
                <div className="w-full">
                    <input
                        ref={ref}
                        type="url"
                        value={stringValue}
                        onChange={(e) => onChange(e.target.value)}
                        onBlur={onExit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === 'Escape') onExit();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        placeholder="https://example.com"
                        className={`w-full border-none outline-none bg-transparent ${
                            stringValue.trim() && !isValid ? 'text-red-500' : ''
                        }`}
                    />
                    {stringValue.trim() && !isValid && (
                        <div className="text-xs text-red-500 mt-1">
                            Invalid URL format
                        </div>
                    )}
                </div>
            );
        }
    };
}
