import { useState } from 'react';
import { Button } from '@/components';
import Modal from '@/components/Modal';
import { useExportFunctions } from './ExportVentureJson';
import ImportVentureJson from './ImportVentureJson';

interface ShareJsonProps {
    values: Record<string, any>;
    onDataImported: (importedData: any) => void;
}

const ShareJson = ({ values, onDataImported }: ShareJsonProps) => {
    const [showImportModal, setShowImportModal] = useState(false);
    const { viewJson, exportJson } = useExportFunctions(values);

    const handleImportData = (importedData: any) => {
        onDataImported(importedData);
        setShowImportModal(false);
    };

    return (
        <>
            <div className="flex gap-3">
                <Button
                    onClick={viewJson}
                    variant="primary"
                >
                    View JSON
                </Button>
                <Button
                    onClick={exportJson}
                    variant="success"
                >
                    Export JSON
                </Button>
                <Button
                    onClick={() => setShowImportModal(true)}
                    variant="primary"
                >
                    Import JSON
                </Button>
            </div>

            {/* Import Modal */}
            <Modal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                title="Import Venture Data"
            >
                <ImportVentureJson onImport={handleImportData} />
            </Modal>
        </>
    );
};

export default ShareJson;
