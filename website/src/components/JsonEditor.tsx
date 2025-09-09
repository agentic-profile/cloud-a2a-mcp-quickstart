import { useCallback } from 'react';
import { Button } from './Button';

export interface JsonExample {
    name: string;
    payload: any;
}

export interface JsonEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: string;
    className?: string;
    showValidation?: boolean;
    disabled?: boolean;
    examples?: JsonExample[];
}

const JsonEditor = ({
    value,
    onChange,
    placeholder = "Enter your JSON here...",
    height = "h-48",
    className = "",
    showValidation = true,
    disabled = false,
    examples = []
}: JsonEditorProps) => {
    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
    }, [onChange]);

    const isValidJson = useCallback(() => {
        try {
            JSON.parse(value);
            return true;
        } catch {
            return false;
        }
    }, [value]);

    const loadExample = useCallback((example: JsonExample) => {
        onChange(JSON.stringify(example.payload, null, 2));
    }, [onChange]);

    const currentIsValid = showValidation ? isValidJson() : true;

    return (
        <div className={`mb-4 ${className}`}>
            {/* Examples */}
            {examples.length > 0 && (
                <div className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {examples.map((example, index) => (
                            <Button
                                key={index}
                                variant="secondary"
                                size="sm"
                                onClick={() => loadExample(example)}
                                disabled={disabled}
                            >
                                {example.name}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
            
            <textarea
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className={`w-full ${height} p-3 font-mono text-sm rounded-md border resize-none ${
                    currentIsValid
                        ? 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                        : 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder={placeholder}
            />
            {showValidation && !currentIsValid && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                    Invalid JSON format
                </div>
            )}
        </div>
    );
};

export default JsonEditor;
