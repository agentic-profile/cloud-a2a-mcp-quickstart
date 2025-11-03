import { useCallback } from 'react';

export interface MultilineTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: string;
    className?: string;
    disabled?: boolean;
    rows?: number;
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const MultilineTextEditor = ({
    value,
    onChange,
    placeholder = "Enter text...",
    height,
    className = "",
    disabled = false,
    rows = 6,
    resize = 'vertical'
}: MultilineTextEditorProps) => {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
    }, [onChange]);

    const resizeClass = {
        'none': 'resize-none',
        'vertical': 'resize-y',
        'horizontal': 'resize-x',
        'both': 'resize'
    }[resize];

    return (
        <div className={className}>
            <textarea
                value={value}
                onChange={handleChange}
                disabled={disabled}
                rows={rows}
                className={`w-full ${height || ''} px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    disabled 
                        ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600' 
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                } ${resizeClass}`}
                placeholder={placeholder}
            />
        </div>
    );
};

export default MultilineTextEditor;

