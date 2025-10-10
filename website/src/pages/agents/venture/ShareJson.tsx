import { useState } from 'react';
import { Button } from '@/components';
import Modal from '@/components/Modal';
import { useExportFunctions } from './ExportVentureJson';
import ImportVentureJson from './ImportVentureJson';
import { simplifyVentureWorksheet } from '@/stores/venture-utils';
import { type VentureWorksheet } from '@/stores/venture-types';

interface ShareJsonProps {
    values: VentureWorksheet;
    onDataImported: (importedData: any) => void;
}

const ShareJson = ({ values, onDataImported }: ShareJsonProps) => {
    const [showImportModal, setShowImportModal] = useState(false);
    const { viewJson, exportJson } = useExportFunctions(values);

    const cleanValues = simplifyVentureWorksheet(values);
    const { viewJson: viewCleanJson, exportJson: exportCleanJson } = useExportFunctions(cleanValues);

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
                    View Worksheet JSON
                </Button>
                <Button
                    onClick={exportJson}
                    variant="success"
                >
                    Export Worksheet JSON
                </Button>
                <Button
                    onClick={viewCleanJson}
                    variant="primary"
                >
                    View Public JSON
                </Button>
                <Button
                    onClick={exportCleanJson}
                    variant="success"
                >
                    Export Public JSON
                </Button>
                <Button
                    onClick={() => setShowImportModal(true)}
                    variant="primary"
                >
                    Import WorksheetJSON
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
