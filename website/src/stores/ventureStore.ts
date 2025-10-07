import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TabValues {
    id: string;
    values: string[];
    selected: number;
}

export interface AttributedString {
    text: string;
    hidden?: boolean;
}

export type StringOrNumberTable = (string | number)[][];

export interface CellTable {
    values: StringOrNumberTable;
    hidden?: StringOrNumberTable;
}

export type Table = CellTable | StringOrNumberTable | undefined;

//export interface HiddenRows {
//    [key: string]: StringOrNumberTable;
//}

export interface VentureData {
    problem: AttributedString[] | undefined;
    solution: AttributedString[] | undefined;
    team: Table;
    positioning: TabValues[] | undefined;
    marketOpportunity: Table;
    milestones: Table;
    references: Table;
    //hiddenRows?: HiddenRows | undefined;
}

interface ArchivedVentureData extends VentureData {
    name: string;
    updated: string
}

export interface VentureState {
    // Positioning data
    positioning: TabValues[];
    
    // Basic arrays
    problem: AttributedString[];
    solution: AttributedString[];
    
    // Table data (arrays of arrays with mixed string/number types)
    marketOpportunity: CellTable;
    milestones: CellTable;
    team: CellTable;
    references: CellTable;
    //hiddenRows: HiddenRows;
    
    // Archive data
    archiveName: string;
    archive: ArchivedVentureData[];
    
    // Actions for positioning data
    setPositioning: (positioning: TabValues[]) => void;
    updatePositioningTab: (tabId: string, values: string[], selected: number) => void;
    resetPositioning: () => void;
    
    // Actions for basic arrays
    setProblem: (problem: AttributedString[]) => void;
    setSolution: (solution: AttributedString[]) => void;
    
    // Actions for table data
    setMarketOpportunity: (marketOpportunity: CellTable) => void;
    setMilestones: (milestones: CellTable) => void;
    setTeam: (team: CellTable) => void;
    setReferences: (references: CellTable) => void;
    //setHiddenRows: (hiddenRows: HiddenRows) => void;
    
    // Actions for archive
    setArchiveName: (name: string) => void;
    archiveVenture: (name: string) => void;
    removeFromArchive: (index: number) => void;
    clearArchive: () => void;
    
    // Bulk actions
    setVentureData: (data: Partial<VentureState>) => void;
    getVentureData: () => VentureData;
    clearVentureData: () => void;
}

// Default positioning tabs structure
const POSITIONING_TABS = [
    { id: "forWho", title: "For who", placeholder: "Enter target market..." },
    { id: "whoNeed", title: "Who needs", placeholder: "Enter customer needs or problems..." },
    { id: "name", title: "Company name", placeholder: "Company or project name..." },
    { id: "productCategory", title: "Product Category", placeholder: "Enter product category..." },
    { id: "keyBenefit", title: "Key Benefit", placeholder: "Enter key benefit..." },
    { id: "unlike", title: "Unlike", placeholder: "Name of closest competitor..." },
    { id: "primaryDifferentiator", title: "Primary Differentiator", placeholder: "Enter primary differentiator..." }
];

// Create empty positioning data
const createEmptyPositioning = (): TabValues[] => 
    POSITIONING_TABS.map(tab => ({
        id: tab.id,
        values: [],
        selected: -1
    }));

export const useVentureStore = create<VentureState>()(
    persist(
        (set, get) => ({
            // Initial state
            positioning: createEmptyPositioning(),
            problem: [],
            solution: [],
            marketOpportunity: { values: [] },
            milestones: { values: [] },
            team: { values: [] },
            references: { values: [] },
            //hiddenRows: {},
            archive: [],
            archiveName: '',
            
            // Positioning actions
            setPositioning: (positioning) => set({ positioning }),
            
            updatePositioningTab: (tabId, values, selected) => 
                set((state) => {
                    const existingTabIndex = state.positioning.findIndex(tab => tab.id === tabId);
                    
                    if (existingTabIndex !== -1) {
                        // Update existing tab
                        return {
                            positioning: state.positioning.map(tab => 
                                tab.id === tabId 
                                    ? { ...tab, values, selected }
                                    : tab
                            )
                        };
                    } else {
                        // Create new tab if not found
                        const newTab: TabValues = {
                            id: tabId,
                            values,
                            selected
                        };
                        return {
                            positioning: [...state.positioning, newTab]
                        };
                    }
                }),
            
            resetPositioning: () => set({ positioning: createEmptyPositioning() }),
            
            // Basic array actions
            setProblem: (problem) => set({ problem }),
            setSolution: (solution) => set({ solution }),
            
            // Table data actions
            setMarketOpportunity: (marketOpportunity) => set({ marketOpportunity }),
            setMilestones: (milestones) => set({ milestones }),
            setTeam: (team) => set({ team }),
            setReferences: (references) => set({ references }),
            //setHiddenRows: (hiddenRows) => set({ hiddenRows }),

            // Archive actions
            setArchiveName: (name) => set({ archiveName: name }),
            archiveVenture: (name) => {
                const state = get();
                const updated = new Date().toISOString();
                const archivedVenture: ArchivedVentureData = {
                    name,
                    updated,
                    problem: state.problem,
                    solution: state.solution,
                    team: state.team,
                    positioning: state.positioning,
                    marketOpportunity: state.marketOpportunity,
                    milestones: state.milestones,
                    references: state.references,
                    //hiddenRows: state.hiddenRows,
                };
                                
                set((state) => {
                    // Remove any existing venture with this name and add new one to first position
                    const filteredArchive = state.archive.filter(item => item.name !== name);
                    return { archive: [archivedVenture, ...filteredArchive] };
                });
            },
            
            removeFromArchive: (index) => 
                set((state) => ({
                    archive: state.archive.filter((_, i) => i !== index)
                })),
            
            clearArchive: () => set({ archive: [] }),
            
            // Bulk actions
            setVentureData: (data) => {
                // Helper to normalize table data to CellTable format
                const normalizeCellTable = (value: any): CellTable => {
                    if (!value) return { values: [] };
                    if (Array.isArray(value)) return { values: value };
                    if (typeof value === 'object' && 'values' in value) return value;
                    return { values: [] };
                };

                set((prev) => ({
                    ...prev,
                    positioning: data.positioning || createEmptyPositioning(),
                    problem: data.problem || [],
                    solution: data.solution || [],
                    marketOpportunity: normalizeCellTable(data.marketOpportunity),
                    milestones: normalizeCellTable(data.milestones),
                    team: normalizeCellTable(data.team),
                    references: normalizeCellTable(data.references),
                    //hiddenRows: data.hiddenRows || {},
                }));
            },
            
            clearVentureData: () => set((prev) => ({
                ...prev,
                positioning: createEmptyPositioning(),
                problem: [],
                solution: [],
                marketOpportunity: { values: [] },
                milestones: { values: [] },
                team: { values: [] },
                references: { values: [] },
            })),

            getVentureData: () => {
                const state = get();
                return {
                    positioning: state.positioning,
                    problem: state.problem,
                    solution: state.solution,
                    marketOpportunity: state.marketOpportunity,
                    milestones: state.milestones,
                    team: state.team,
                    references: state.references,
                    //hiddenRows: state.hiddenRows,
                };
            },
        }),
        {
            name: 'venture-storage',
            // Only persist the data, not the functions
            partialize: (state) => ({
                positioning: state.positioning,
                problem: state.problem,
                solution: state.solution,
                marketOpportunity: state.marketOpportunity,
                milestones: state.milestones,
                team: state.team,
                references: state.references,
                //hiddenRows: state.hiddenRows,
                archive: state.archive,
            }),
        }
    )
);

//
// Pruning to eliminate empty values
//

export function pruneVentureData (venture: VentureData)  {
    return {
        problem: pruneAttributedStrings(venture.problem),
        solution: pruneAttributedStrings(venture.solution),
        team: pruneTable(venture.team),
        positioning: prunePositioning(venture.positioning),
        marketOpportunity: pruneTable(venture.marketOpportunity),
        milestones: pruneTable(venture.milestones),
        references: pruneTable(venture.references),
        //hiddenRows: venture.hiddenRows,
    };
}

export function pruneArray(array: string[]) {
    const filtered = array.filter(item => item !== '');
    return filtered.length === 0 ? undefined : filtered;
}

export function pruneAttributedStrings(array: AttributedString[] | undefined) {
    return array?.filter(e=>e.text!=='');
}

export function pruneTable(table: Table) {

    if( !table )
        return undefined;

    if( Array.isArray(table) ) {
        const filtered = table?.filter(row => !row.every(item => item === ''));
        return filtered?.length === 0 ? undefined : filtered;
    }

    if( typeof table === 'object' && 'values' in table ) {
        const filtered = table.values?.filter(row => !row.every(item => item === ''));
        return filtered?.length === 0 ? undefined : filtered;
    }

    console.error('pruneTable() found unknown table type:', table);
}

export function prunePositioning(positioning: TabValues[] | undefined) {
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

export interface SimplifiedVentureData {
    problem: string[] | undefined;
    solution: string[] | undefined;
    team: StringOrNumberTable | undefined;
    positioning: SimplifiedPositioning | undefined;
    marketOpportunity: StringOrNumberTable | undefined;
    milestones: StringOrNumberTable | undefined;
    references: StringOrNumberTable | undefined;
}

function simplifyAttributedStrings(attributedStrings: AttributedString[] | undefined) {
    return attributedStrings?.filter(e=>e.hidden!==true).map(e=>e.text);
}

function simplifyPositioning(positioning: TabValues[] | undefined) {
    return positioning?.reduce((acc, tab) => ({
        ...acc,
        [tab.id]: tab.values[tab.selected]
    }), {} as SimplifiedPositioning);
}

export function simplifyVentureData(venture: VentureData) {
    venture = pruneVentureData(venture);
    return {
        problem: simplifyAttributedStrings(venture.problem),
        solution: simplifyAttributedStrings(venture.solution),
        team: simplifyTable(venture.team),
        positioning: simplifyPositioning(venture.positioning),
        marketOpportunity: simplifyTable(venture.marketOpportunity),
        milestones: simplifyTable(venture.milestones),
        references: simplifyTable(venture.references),
    } as SimplifiedVentureData;
}

function simplifyTable(table: Table) {
    if( !table )
        return undefined;

    if( Array.isArray(table) )
        return table;
    else if( typeof table === 'object' && 'values' in table )
        return table.values;

    console.error('simplifyTable() found unknown table type:', table);
}