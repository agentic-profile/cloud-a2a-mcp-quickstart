import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TabValues {
    id: string;
    values: string[];
    selected: number;
}

export interface VentureData {
    problem: string[] | undefined;
    solution: string[] | undefined;
    team: (string | number)[][] | undefined;
    positioning: TabValues[] | undefined;
    marketOpportunity: (string | number)[][] | undefined;
    milestones: (string | number)[][] | undefined;
    references: (string | number)[][] | undefined;
}

export interface VentureState {
    // Positioning data
    positioning: TabValues[];
    
    // Basic arrays
    problem: string[];
    solution: string[];
    
    // Table data (arrays of arrays with mixed string/number types)
    marketOpportunity: (string | number)[][];
    milestones: (string | number)[][];
    team: (string | number)[][];
    references: (string | number)[][];
    
    // Actions for positioning data
    setPositioning: (positioning: TabValues[]) => void;
    updatePositioningTab: (tabId: string, values: string[], selected: number) => void;
    resetPositioning: () => void;
    
    // Actions for basic arrays
    setProblem: (problem: string[]) => void;
    setSolution: (solution: string[]) => void;
    
    // Actions for table data
    setMarketOpportunity: (marketOpportunity: (string | number)[][]) => void;
    setMilestones: (milestones: (string | number)[][]) => void;
    setTeam: (team: (string | number)[][]) => void;
    setReferences: (references: (string | number)[][]) => void;
    
    // Bulk actions
    importVentureData: (data: Partial<VentureState>) => void;
    clearAllData: () => void;
    
    // Utility actions
    prunedVentureData: () => VentureData;
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
            
            // Positioning actions
            setPositioning: (positioning) => set({ positioning }),
            
            updatePositioningTab: (tabId, values, selected) => 
                set((state) => ({
                    positioning: state.positioning.map(tab => 
                        tab.id === tabId 
                            ? { ...tab, values, selected }
                            : tab
                    )
                })),
            
            resetPositioning: () => set({ positioning: createEmptyPositioning() }),
            
            // Basic array actions
            setProblem: (problem) => set({ problem }),
            setSolution: (solution) => set({ solution }),
            
            // Table data actions
            setMarketOpportunity: (marketOpportunity) => set({ marketOpportunity }),
            setMilestones: (milestones) => set({ milestones }),
            setTeam: (team) => set({ team }),
            setReferences: (references) => set({ references }),
            
            // Bulk actions
            importVentureData: (data) => {
                console.log('Importing venture data:', data);
                console.log('Positioning data from import:', data.positioning);
                if (data.positioning) {
                    console.log('Positioning tabs found:', data.positioning.map(tab => tab.id));
                }
                set(() => ({
                    positioning: data.positioning || createEmptyPositioning(),
                    problem: data.problem || [],
                    solution: data.solution || [],
                    marketOpportunity: data.marketOpportunity || [],
                    milestones: data.milestones || [],
                    team: data.team || [],
                    references: data.references || [],
                }));
            },
            
            clearAllData: () => set({
                positioning: createEmptyPositioning(),
                problem: [],
                solution: [],
                marketOpportunity: [],
                milestones: [],
                team: [],
                references: [],
            }),
            
            // Utility action to get all venture data in the format expected by the page
            prunedVentureData: () => {
                const state = get();
                return {
                    problem: pruneArray(state.problem),
                    solution: pruneArray(state.solution),
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
            }),
        }
    )
);

export function pruneArray(array: string[]) {
    const filtered = array.filter(item => item !== '');
    return filtered.length === 0 ? undefined : filtered;
}

export function pruneTable(table: (string | number)[][]) {
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