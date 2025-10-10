import { Button } from '@/components';
import { CardTitleAndBody } from '@/components/Card';
import ShareJson from './ShareJson';
import ArchiveVenture from './ArchiveVenture';
import { useVentureStore } from '@/stores/ventureStore';
import { pruneVentureWorksheet } from '@/stores/venture-utils';

const AdvancedFeatures = () => {

    const {
        setVentureWorksheet,
        clearVentureWorksheet,
        getVentureWorksheet
    } = useVentureStore();

    const ventureData = pruneVentureWorksheet(getVentureWorksheet()); // remove empty values and blank lines

    return (
        <CardTitleAndBody title="More Advanced Features..." collapsed={true}>
            <div className="space-y-4">
                <div className="flex gap-3">
                    <Button
                        onClick={clearVentureWorksheet}
                        variant="danger"
                    >
                        Clear All Data
                    </Button>
                </div>
                <ShareJson
                    values={ventureData}
                    onDataImported={setVentureWorksheet}
                />
                <ArchiveVenture />
            </div>
        </CardTitleAndBody>
    );
};

export default AdvancedFeatures;
