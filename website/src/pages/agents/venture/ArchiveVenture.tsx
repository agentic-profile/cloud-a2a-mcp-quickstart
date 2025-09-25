import { useState } from 'react';
import { Button } from '@/components';
import { useVentureStore } from '@/stores/ventureStore';
import Icon from '@/components/Icon';
import folderOpenIcon from '@iconify-icons/lucide/folder-open';
import trashIcon from '@iconify-icons/lucide/trash';

const ArchiveVenture = () => {
    const [archiveName, setArchiveName] = useState('');
    const { archive, addToArchive, importVentureData, removeFromArchive } = useVentureStore();

    const handleArchive = () => {
        const name = archiveName.trim();
        if (name) {
            addToArchive(name);
            //setArchiveName('');
        }
    };

    const handleOpenArchive = (archivedItem: any) => {
        // Remove the name property before importing
        const { name, ...ventureData } = archivedItem;
        
        importVentureData(ventureData);
    };

    const handleDeleteArchive = (index: number) => {
        removeFromArchive(index);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-3 items-center">
                <input
                    type="text"
                    value={archiveName}
                    onChange={(e) => setArchiveName(e.target.value)}
                    placeholder="Enter archive name..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleArchive()}
                />
                <Button
                    onClick={handleArchive}
                    variant="primary"
                    disabled={!archiveName.trim()}
                >
                    Archive
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
                                <Icon
                                    src={folderOpenIcon}
                                    onClick={() => handleOpenArchive(item)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 cursor-pointer"
                                />
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                    {item.name}
                                </span>
                            </div>
                            <Icon
                                src={trashIcon}
                                onClick={() => handleDeleteArchive(index)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 cursor-pointer"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArchiveVenture;
