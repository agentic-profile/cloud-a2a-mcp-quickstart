import type { TabValues } from '@/components/TabbedEditableLists';
import { generatePositioningStatement } from './positioning';

export function PositioningStatement({ tabValues }: { tabValues: TabValues[] }) {
    const positioning = tabValues.reduce((acc, tab) => {
        acc[tab.id] = tab.values[tab.selected];
        return acc;
    }, {} as Record<string, string>);

    const positioningStatement = generatePositioningStatement(positioning);
    return (
        <div className="text-xl italic text-center my-6 max-w-2xl mx-auto">
            {positioningStatement}
        </div>
    );
};
