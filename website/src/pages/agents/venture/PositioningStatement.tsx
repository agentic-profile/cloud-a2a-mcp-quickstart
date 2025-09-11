import type { TabValues } from '@/components/TabbedEditableLists';

export function PositioningStatement({ tabValues }: { tabValues: TabValues[] }) {
    const { forWho, whoNeed, productCategory, keyBenefit, unlike, primaryDifferentiator } = tabValues.reduce((acc, tab) => {
        acc[tab.id] = tab.values[tab.selected];
        return acc;
    }, {} as Record<string, string>);

    const company = "Our company";

    const positioningStatement = `"For ${render(forWho)} that need ${render(whoNeed)}, ${render(company)} is a ${render(productCategory)} that ${render(keyBenefit)}. Unlike ${render(unlike)}, our product ${render(primaryDifferentiator)}."`;
    return (
        <div className="text-xl italic text-center my-6 max-w-2xl mx-auto">
            {positioningStatement}
        </div>
    );
};

function render(text: string | undefined | null) {
    text = text?.trim()
    return text && text.length > 0 ? text : "________________________";
}