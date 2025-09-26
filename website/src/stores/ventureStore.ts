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

export interface HiddenRows {
    [key: string]: StringOrNumberTable;
}

export interface VentureData {
    problem: AttributedString[] | undefined;
    solution: AttributedString[] | undefined;
    team: StringOrNumberTable | undefined;
    positioning: TabValues[] | undefined;
    marketOpportunity: StringOrNumberTable | undefined;
    milestones: StringOrNumberTable | undefined;
    references: StringOrNumberTable | undefined;
    hiddenRows: HiddenRows | undefined;
}

export interface PrunedVentureData {
    problem: string[] | undefined;
    solution: string[] | undefined;
    team: StringOrNumberTable | undefined;
    positioning: TabValues[] | undefined;
    marketOpportunity: StringOrNumberTable | undefined;
    milestones: StringOrNumberTable | undefined;
    references: StringOrNumberTable | undefined;
}

interface ArchivedVentureData extends VentureData {
    name: string;
}

export interface VentureState {
    // Positioning data
    positioning: TabValues[];
    
    // Basic arrays
    problem: AttributedString[];
    solution: AttributedString[];
    
    // Table data (arrays of arrays with mixed string/number types)
    marketOpportunity: (string | number)[][];
    milestones: (string | number)[][];
    team: (string | number)[][];
    references: (string | number)[][];
    hiddenRows: HiddenRows;
    
    // Archive data
    archive: ArchivedVentureData[];
    
    // Actions for positioning data
    setPositioning: (positioning: TabValues[]) => void;
    updatePositioningTab: (tabId: string, values: string[], selected: number) => void;
    resetPositioning: () => void;
    
    // Actions for basic arrays
    setProblem: (problem: AttributedString[]) => void;
    setSolution: (solution: AttributedString[]) => void;
    
    // Actions for table data
    setMarketOpportunity: (marketOpportunity: StringOrNumberTable) => void;
    setMilestones: (milestones: StringOrNumberTable) => void;
    setTeam: (team: StringOrNumberTable) => void;
    setReferences: (references: StringOrNumberTable) => void;
    setHiddenRows: (hiddenRows: HiddenRows) => void;
    
    // Actions for archive
    addToArchive: (name: string) => void;
    removeFromArchive: (index: number) => void;
    clearArchive: () => void;
    
    // Bulk actions
    importVentureData: (data: Partial<VentureState>) => void;
    clearVentureData: () => void;
    
    // Utility actions
    allVentureData: () => VentureData;
    prunedVentureData: () => PrunedVentureData;
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
            marketOpportunity: [],
            milestones: [],
            team: [],
            references: [],
            hiddenRows: {},
            archive: [],
            
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
            setHiddenRows: (hiddenRows) => set({ hiddenRows }),

            // Archive actions
            addToArchive: (name) => {
                const state = get();
                const ventureData: VentureData = {
                    problem: state.problem,
                    solution: state.solution,
                    team: state.team,
                    positioning: state.positioning,
                    marketOpportunity: state.marketOpportunity,
                    milestones: state.milestones,
                    references: state.references,
                    hiddenRows: state.hiddenRows,
                };
                
                const archivedVenture: ArchivedVentureData = {
                    ...ventureData,
                    name,
                };
                
                set((state) => ({
                    archive: [...state.archive, archivedVenture]
                }));
            },
            
            removeFromArchive: (index) => 
                set((state) => ({
                    archive: state.archive.filter((_, i) => i !== index)
                })),
            
            clearArchive: () => set({ archive: [] }),
            
            // Bulk actions
            importVentureData: (data) => {
                set((prev) => ({
                    ...prev,
                    positioning: data.positioning || createEmptyPositioning(),
                    problem: data.problem || [],
                    solution: data.solution || [],
                    marketOpportunity: data.marketOpportunity || [],
                    milestones: data.milestones || [],
                    team: data.team || [],
                    references: data.references || [],
                    hiddenRows: data.hiddenRows || {},
                }));
            },
            
            clearVentureData: () => set((prev) => ({
                ...prev,
                positioning: createEmptyPositioning(),
                problem: [],
                solution: [],
                marketOpportunity: [],
                milestones: [],
                team: [],
                references: [],
                hiddenRows: {},
            })),

            allVentureData: () => {
                const state = get();
                return {
                    positioning: state.positioning,
                    problem: state.problem,
                    solution: state.solution,
                    marketOpportunity: state.marketOpportunity,
                    milestones: state.milestones,
                    team: state.team,
                    references: state.references,
                    hiddenRows: state.hiddenRows,
                };
            },
            
            // Utility action to get all venture data in the format expected by the page
            prunedVentureData: () => {
                const state = get();
                return {
                    problem: pruneAttributedStrings(state.problem),
                    solution: pruneAttributedStrings(state.solution),
                    team: pruneTable(state.team),
                    positioning: prunePositioning(state.positioning),
                    marketOpportunity: pruneTable(state.marketOpportunity),
                    milestones: pruneTable(state.milestones),
                    references: pruneTable(state.references),
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
                hiddenRows: state.hiddenRows,
                archive: state.archive,
            }),
        }
    )
);

export function pruneArray(array: string[]) {
    const filtered = array.filter(item => item !== '');
    return filtered.length === 0 ? undefined : filtered;
}

export function pruneAttributedStrings(array: AttributedString[]) {
    return array.map(e=>e.text).filter(e=>e!=='');
}

export function pruneTable(table: StringOrNumberTable) {
    const filtered = table.filter(row => !row.every(item => item === ''));
    return filtered.length === 0 ? undefined : filtered;
}

export function prunePositioning(positioning: TabValues[]) {
    const filtered = positioning
        .map(tab => {
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
    
    return filtered.length === 0 ? undefined : filtered;
}