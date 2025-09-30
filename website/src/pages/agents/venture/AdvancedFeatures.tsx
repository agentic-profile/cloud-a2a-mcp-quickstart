import { Button } from '@/components';
import { CardTitleAndBody } from '@/components/Card';
import ShareJson from './ShareJson';
import ArchiveVenture from './ArchiveVenture';
import { useVentureStore, pruneVentureData } from '@/stores/ventureStore';

const AdvancedFeatures = () => {

    const {
        setVentureData,
        clearVentureData,
        getVentureData
    } = useVentureStore();

    const ventureData = pruneVentureData(getVentureData()); // remove empty values and blank lines

    return (
        <CardTitleAndBody title="More Advanced Features..." collapsed={true}>
            <div className="space-y-4">
                <div className="flex gap-3">
                    <Button
                        onClick={clearVentureData}
                        variant="danger"
                    >
                        Clear All Data
                    </Button>
                </div>
                <ShareJson
                    values={ventureData}
                    onDataImported={setVentureData}
                />
                <ArchiveVenture />
            </div>
        </CardTitleAndBody>
    );
};

export default AdvancedFeatures;
