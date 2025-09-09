export interface VentureProfile {
    uuid: string;
    did: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface VentureProfileStore {
    saveVentureProfile(profile: VentureProfile): Promise<void>;
    loadVentureProfile(did: string): Promise<VentureProfile | undefined>;
    queryVentureProfiles(): Promise<VentureProfile[]>;
    deleteVentureProfile(did: string): Promise<void>;
    listAllItems(): Promise<any[]>;
}