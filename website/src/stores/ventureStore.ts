import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type VentureWorksheet, type CellTable, type AttributedString, type TabValues } from "./venture-types";

interface ArchivedVentureWorksheet extends VentureWorksheet {
    name: string;
    updated: string
}

export interface VentureState extends VentureWorksheet {
    
    // Archive data
    archiveName: string;
    archive: ArchivedVentureWorksheet[];
    
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
    
    // Actions for archive
    setArchiveName: (name: string) => void;
    archiveVenture: (name: string) => void;
    removeFromArchive: (index: number) => void;
    clearArchive: () => void;
    
    // Bulk actions
    setVentureWorksheet: (data: Partial<VentureState>) => void;
    getVentureWorksheet: () => VentureWorksheet;
    clearVentureWorksheet: () => void;
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
            archive: [],
            archiveName: '',
            
            // Positioning actions
            setPositioning: (positioning) => set({ 
                positioning: Array.isArray(positioning) ? positioning : createEmptyPositioning() 
            }),
            
            updatePositioningTab: (tabId, values, selected) => 
                set((state) => {
                    // Ensure positioning is always an array
                    if (!Array.isArray(state.positioning)) {
                        state.positioning = createEmptyPositioning();
                    }
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

            // Archive actions
            setArchiveName: (name) => set({ archiveName: name }),
            archiveVenture: (name) => {
                const state = get();
                const updated = new Date().toISOString();
                const archivedVenture: ArchivedVentureWorksheet = {
                    name,
                    updated,
                    problem: state.problem,
                    solution: state.solution,
                    team: state.team,
                    positioning: state.positioning,
                    marketOpportunity: state.marketOpportunity,
                    milestones: state.milestones,
                    references: state.references,
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
            setVentureWorksheet: (data) => {
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
                }));
            },
            
            clearVentureWorksheet: () => set((prev) => ({
                ...prev,
                positioning: createEmptyPositioning(),
                problem: [],
                solution: [],
                marketOpportunity: { values: [] },
                milestones: { values: [] },
                team: { values: [] },
                references: { values: [] },
            })),

            getVentureWorksheet: () => {
                const state = get();
                return {
                    positioning: state.positioning,
                    problem: state.problem,
                    solution: state.solution,
                    marketOpportunity: state.marketOpportunity,
                    milestones: state.milestones,
                    team: state.team,
                    references: state.references,
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
                archive: state.archive,
            }),
            // Add migration to ensure positioning is always an array
            migrate: (persistedState: any) => {
                if (persistedState.positioning && !Array.isArray(persistedState.positioning)) {
                    persistedState.positioning = createEmptyPositioning();
                }
                return persistedState;
            },
        }
    )
);
