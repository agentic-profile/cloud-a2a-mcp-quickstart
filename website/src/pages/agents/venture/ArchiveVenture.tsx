import { Button, IconButton } from '@/components';
import { useVentureStore } from '@/stores/ventureStore';
import { FolderOpenIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatShortDateTime } from '@/tools/dates';
import { deepEqual } from '@/tools/misc';


const ArchiveVenture = () => {
    const { archive, archiveVenture, setVentureData, removeFromArchive, archiveName, setArchiveName, getVentureData } = useVentureStore();

    const handleArchiveVenture = () => {
        const name = archiveName.trim();
        if (name) {
            archiveVenture(name);
        }
    };

    const handleLoadArchivedVenture = (archivedItem: any) => {
        // Remove the name property before importing
        const { name, ...ventureData } = archivedItem;
        setVentureData(ventureData);

        setArchiveName(name);
    };

    const handleDeleteArchive = (index: number) => {
        removeFromArchive(index);
    };

    const hasChanged = (archivedItem: any | undefined) => {
        if (!archivedItem)
            return true;

        const { name, updated, ...ventureData } = archivedItem;
        const current = getVentureData();
        return deepEqual(ventureData, current) != true;
    };


    const archiveItem = archive.find(item => item.name === archiveName);
    const isChanged = hasChanged(archiveItem);
    const saveLabel = archiveItem ? 'Update' : 'Save';
    const disableSave = !(archiveName.trim() && isChanged);
    console.log(`archive ${archiveName} isChanged: ${isChanged}, disableSave: ${disableSave}`);

    return (
        <div className="space-y-4">
            <div className="flex gap-3 items-center">
                <input
                    type="text"
                    value={archiveName}
                    onChange={(e) => setArchiveName(e.target.value)}
                    placeholder="Enter unique venture name..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleArchiveVenture()}
                />
                <Button
                    onClick={handleArchiveVenture}
                    variant="primary"
                    disabled={disableSave}
                >
                    {saveLabel}
                </Button>
            </div>

            {archive.length > 0 && (
                <div className="space-y-1">
                    {archive.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <IconButton
                                    icon={<FolderOpenIcon />}
                                    onClick={() => handleLoadArchivedVenture(item)}
                                    title="Open archive"
                                />
                                <span className={`sm ${item.name === archiveName ? 'font-bold' : ''}`}>
                                    {item.name} {item.updated ? `(${formatShortDateTime(item.updated)})` : ''}
                                </span>
                            </div>
                            <IconButton
                                icon={<TrashIcon />}
                                onClick={() => handleDeleteArchive(index)}
                                variant="danger"
                                title="Delete archive"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArchiveVenture;
