import {
    ClientAgentSession,
    ClientAgentSessionStore,
    ClientAgentSessionUpdates,
} from "@agentic-profile/auth";
import {
    AgenticProfileStore,
} from "@agentic-profile/common";
import { AgenticProfile } from "@agentic-profile/common/schema";

let nextSessionId = 1;
const sessionCache = new Map<number, ClientAgentSession>();

export const clientAgentSessionStore = {
    async createClientAgentSession(challenge: string): Promise<number> {
        const id = nextSessionId++;
        sessionCache.set(id, { id, challenge } as ClientAgentSession);
        return id;
    },
    async fetchClientAgentSession(id: number): Promise<ClientAgentSession | undefined> {
        return sessionCache.get(id);
    },
    async updateClientAgentSession(id: number, updates: ClientAgentSessionUpdates): Promise<void> {
        const session = sessionCache.get(id);
        if (session) {
            sessionCache.set(id, { ...session, ...updates });
        }
    }
} as ClientAgentSessionStore;

const profileCache = new Map<string, AgenticProfile>();

export const agenticProfileStore = {
    async saveAgenticProfile(profile: any): Promise<void> {
        profileCache.set(profile.id, profile);
    },
    async loadAgenticProfile(did: string): Promise<any | undefined> {
        return profileCache.get(did);
    },
    async dump(): Promise<any> {
        return {
            profiles: Array.from(profileCache.values())
        }
    }
} as AgenticProfileStore;