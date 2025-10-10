import { useState } from 'react';
import { Button } from '@/components';
import Modal from '@/components/Modal';
import { useExportFunctions } from './ExportVentureJson';
import ImportVentureJson from './ImportVentureJson';
import { summarizeVentureWorksheet } from '@/stores/venture-utils';
import { type VentureWorksheet } from '@/stores/venture-types';

interface ShareJsonProps {
    values: VentureWorksheet;
    onDataImported: (importedData: any) => void;
}

const ShareJson = ({ values, onDataImported }: ShareJsonProps) => {
    const [showImportModal, setShowImportModal] = useState(false);
    const { viewJson, exportJson } = useExportFunctions(values);

    const ventureSummary = summarizeVentureWorksheet(values);
    const { viewJson: viewVentureSummary, exportJson: exportVentureSummary } = useExportFunctions(ventureSummary);

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
                    onClick={() => setShowImportModal(true)}
                    variant="primary"
                >
                    Import Worksheet JSON
                </Button>
            </div>
            <div className="flex gap-3">
                <Button
                    onClick={viewVentureSummary}
                    variant="primary"
                >
                    View Public JSON
                </Button>
                <Button
                    onClick={exportVentureSummary}
                    variant="success"
                >
                    Export Public JSON
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
