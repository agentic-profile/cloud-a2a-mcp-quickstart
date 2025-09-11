import React from 'react';

export interface EditableTableProps {
    placeholders?: string[];
    columns: EditableTableColumn[];
    values?: string[][];
    onUpdate?: (values: string[][]) => void;
}

export const EditableTable = ({ columns, values = [] }: EditableTableProps) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} className="border border-gray-300 px-4 py-2 bg-gray-100 text-left">
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {values.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="border border-gray-300 px-4 py-2">
                                    {column.renderCell ? 
                                        column.renderCell(row[colIndex] || '', rowIndex, colIndex) : 
                                        (row[colIndex] || '')
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

interface EditableTableColumn {
    header: string;
    renderCell?: (value: string, rowIndex: number, colIndex: number) => React.ReactNode;
}

export function EditableTextColumn(header: string): EditableTableColumn {
    return {
        header,
        renderCell: (value: string) => (
            <span className="text-gray-900">{value}</span>
        )
    };
}