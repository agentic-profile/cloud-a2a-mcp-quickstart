//
// Complex types that also support hidden fields for interactive worksheets
//
export interface VentureWorksheet {
    problem: AttributedString[];
    solution: AttributedString[];
    team: CellTable;
    positioning: Positioning;
    marketOpportunity: CellTable;
    milestones: CellTable;
    references: CellTable;
}

export interface TabValues {
    id: string;
    values: string[];
    selected: number;
}
export type Positioning = TabValues[];

export interface AttributedString {
    text: string;
    hidden?: boolean;
}

export type StringOrNumberTable = (string | number)[][];
export interface CellTable {
    values: StringOrNumberTable | undefined;
    hidden?: StringOrNumberTable | undefined;
}


//
// Simplified to make it easier to parse
//

export interface SimplifiedPositioning {
    forWho?: string | undefined;
    whoNeed?: string | undefined;
    name?: string | undefined;
    productCategory?: string | undefined;
    keyBenefit?: string | undefined;
    unlike?: string | undefined;
    primaryDifferentiator?: string | undefined;
}

export interface VentureSummary {
    problem: string[] | undefined;
    solution: string[] | undefined;
    team: StringOrNumberTable | undefined;
    positioning: SimplifiedPositioning | undefined;
    marketOpportunity: StringOrNumberTable | undefined;
    milestones: StringOrNumberTable | undefined;
    references: StringOrNumberTable | undefined;
}