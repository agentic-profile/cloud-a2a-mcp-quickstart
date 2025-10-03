import { storeValue, getValue } from "../../cache/redis.js";

// TTL constants (in seconds)
const SESSION_TTL = 60 * 60; // one hour for sessions

export function a2aContextStore<T>( prefix: string ) {
    return {
        async fetchContext(contextId: string): Promise<T | undefined> {
            return await getValue(`${prefix}/${contextId}`);
        },
        
        async updateContext(contextId: string, context: T): Promise<void> {
            await storeValue(`${prefix}/${contextId}`, context, SESSION_TTL);
        }
    }
}