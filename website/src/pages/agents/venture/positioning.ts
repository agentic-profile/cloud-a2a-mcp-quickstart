import type { SimplifiedPositioning } from "@/stores/ventureStore";

/**
 * Generate positioning statement from extracted values
 */
export function generatePositioningStatement(positioningValues: SimplifiedPositioning): string {
    const { forWho, whoNeed, name, productCategory, keyBenefit, unlike, primaryDifferentiator } = positioningValues;
    const an = selectAorAn(productCategory);
    return `For ${renderPositioning(forWho)} that ${renderPositioning(whoNeed)}, ${renderPositioning(name)} is ${an} ${renderPositioning(productCategory)} that ${renderPositioning(keyBenefit)}. Unlike ${renderPositioning(unlike)}, our product ${renderPositioning(primaryDifferentiator)}.`;
}

/**
 * Helper function to render positioning values with placeholders for empty values
 */
export function renderPositioning(text: string | undefined | null): string {
    text = text?.trim();
    return text && text.length > 0 ? text : "________________________";
}

function selectAorAn(word: string | undefined | null): string {
    const firstLetter = word?.trim().charAt(0);
    return firstLetter && "aeiouAEIOU".includes(firstLetter) ? "an" : "a";
}