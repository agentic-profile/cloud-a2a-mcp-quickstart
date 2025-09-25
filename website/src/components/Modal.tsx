import { Button } from '@/components';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
    maxHeight?: string;
}

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    maxWidth = "max-w-2xl",
    maxHeight = "max-h-[90vh]"
}: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`bg-white dark:bg-gray-800 rounded-lg ${maxWidth} w-full ${maxHeight} overflow-y-auto`}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {title}
                        </h2>
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
