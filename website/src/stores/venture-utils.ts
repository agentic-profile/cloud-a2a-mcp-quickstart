import { type AttributedString, type VentureWorksheet, type CellTable, type StringOrNumberTable, type Positioning, type SimplifiedPositioning, type VentureSummary } from "./venture-types";


//
// Pruning to eliminate empty values.  Does not remove any data like hidden rows.
//

export function pruneVentureWorksheet (venture: VentureWorksheet)  {
    return {
        problem: pruneAttributedStrings(venture.problem),
        solution: pruneAttributedStrings(venture.solution),
        team: pruneCellTable(venture.team),
        positioning: prunePositioning(venture.positioning),
        marketOpportunity: pruneCellTable(venture.marketOpportunity),
        milestones: pruneCellTable(venture.milestones),
        references: pruneCellTable(venture.references),
    } as VentureWorksheet;
}

export function pruneAttributedStrings(array: AttributedString[]) {
    return array?.filter(e=>!!e.text?.trim());
}

function isEmpty(item: string | number) {
    if( typeof item === 'number' )
        return !!item;
    else if( typeof item === 'string' )
        return item.trim() === '';
    else
        return false;  // unhandled type, so fail safe to "not empty"
}

function pruneStringOrNumberTable(table: StringOrNumberTable | undefined) {
    if( !table )
        return undefined;

    const filtered = table.filter(row => !row.every(isEmpty));
    return filtered?.length === 0 ? undefined : filtered;
}

export function pruneCellTable(table: CellTable) {
    if( !table )
        return undefined;

    if( typeof table === 'object' && 'values' in table ) {
        const values = pruneStringOrNumberTable(table.values);
        const hidden = pruneStringOrNumberTable(table.hidden);
        return { values, hidden };
    }

    console.error(`pruneTable() found unknown table type ${typeof table}: ${table}`);
    return undefined;
}

export function prunePositioning(positioning: Positioning) {
    if( !Array.isArray(positioning) )
        return positioning; // not an array, so it's already pruned

    const filtered = positioning?.map(tab => {
        const nonEmptyValues = tab.values.filter(value => value !== '');
        const selectedValue = tab.selected !== -1 ? tab.values[tab.selected] : '';
        const newSelected = selectedValue !== '' ? nonEmptyValues.indexOf(selectedValue) : -1;
        
        return {
            ...tab,
            values: nonEmptyValues,
            selected: newSelected
        };
    })
    .filter(tab => tab.selected !== -1 && tab.values.length > 0);
    
    return filtered?.length === 0 ? undefined : filtered;
}

function isHidden(item: AttributedString | string) {
    if( typeof item === 'string' )
        return false;
    if( typeof item === 'object' && 'hidden' in item )
        return item.hidden;
    return false;
}

function asText(item: AttributedString | string) {
    if( typeof item === 'string' )
        return item;
    if( typeof item === 'object' && 'text' in item )
        return item.text;
    return undefined;
}

//
// Summarizing removes hidden fields
//

function simplifyAttributedStrings(attributedStrings: AttributedString[]) {
    return attributedStrings?.filter(e=>!isHidden(e)).map(asText);
}

function simplifyPositioning(positioning: Positioning) {
    return positioning?.reduce((acc, tab) => ({
        ...acc,
        [tab.id]: tab.values[tab.selected]
    }), {} as SimplifiedPositioning);
}

export function summarizeVentureWorksheet(venture: VentureWorksheet) {
    venture = pruneVentureWorksheet(venture);
    return {
        problem: simplifyAttributedStrings(venture.problem),
        solution: simplifyAttributedStrings(venture.solution),
        team: simplifyTable(venture.team),
        positioning: simplifyPositioning(venture.positioning),
        marketOpportunity: simplifyTable(venture.marketOpportunity),
        milestones: simplifyTable(venture.milestones),
        references: simplifyTable(venture.references),
    } as VentureSummary;
}

function simplifyTable(table: CellTable) {
   return table?.values;
}