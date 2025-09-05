import {
    ClientAgentSession,
    ClientAgentSessionStore,
    ClientAgentSessionUpdates,
} from "@agentic-profile/auth";
import {
    AgenticProfileStore,
} from "@agentic-profile/common";
import { storeValue, getValue } from "../cache/redis.js";

// Redis key prefixes
const SESSION_KEY_PREFIX = "session:";
const PROFILE_KEY_PREFIX = "profile:";

export const clientAgentSessionStore = {
    async createClientAgentSession(challenge: string): Promise<number> {
        // Generate a large random number for session ID (changeme)
        const sessionId = Math.floor(Math.random() * 1000000000000) + 1000000000000;
        
        // Create and store the session
        const session = { id: sessionId, challenge } as ClientAgentSession;
        await storeValue(`${SESSION_KEY_PREFIX}${sessionId}`, session);
        
        return sessionId;
    },
    
    async fetchClientAgentSession(id: number): Promise<ClientAgentSession | undefined> {
        const session = await getValue(`${SESSION_KEY_PREFIX}${id}`);
        return session || undefined;
    },
    
    async updateClientAgentSession(id: number, updates: ClientAgentSessionUpdates): Promise<void> {
        const session = await getValue(`${SESSION_KEY_PREFIX}${id}`);
        if (session) {
            const updatedSession = { ...session, ...updates };
            await storeValue(`${SESSION_KEY_PREFIX}${id}`, updatedSession);
        }
    }
} as ClientAgentSessionStore;

export const agenticProfileStore = {
    async saveAgenticProfile(profile: any): Promise<void> {
        await storeValue(`${PROFILE_KEY_PREFIX}${profile.id}`, profile);
    },
    
    async loadAgenticProfile(did: string): Promise<any | undefined> {
        const profile = await getValue(`${PROFILE_KEY_PREFIX}${did}`);
        return profile || undefined;
    },
    
    async dump(): Promise<any> {
        // Note: This is a simplified implementation
        // In a production Redis store, you might want to use SCAN to get all profiles
        // For now, this returns an empty array as we can't easily enumerate all keys
        // without additional Redis operations
        return {
            profiles: []
        };
    }
} as AgenticProfileStore;
