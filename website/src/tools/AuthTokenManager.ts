import { useState, useCallback } from 'react';

const tokenStore = new Map<string, string>();

export async function getAuthToken(url:string): Promise<string | null> {
    return tokenStore.get(url) || null;
}

export async function setAuthToken(url:string, token:string): Promise<void> {
    tokenStore.set(url, token);
}

export async function deleteAuthToken(url:string): Promise<void> {
    tokenStore.delete(url);
}

export function useAuthToken(url: string) {
    const [ authToken, setTokenState] = useState<string | null>(() => tokenStore.get(url) || null);

    const setAuthToken = useCallback(async (token: string) => {
        tokenStore.set(url, token);
        setTokenState(token);
    }, [url]);

    const clearAuthToken = useCallback(async () => {
        tokenStore.delete(url);
        setTokenState(null);
    }, [url]);

    /*
    const refreshToken = useCallback(async () => {
        const currentToken = await getAuthToken(url);
        setTokenState(currentToken);
        return currentToken;
    }, [url]);
    */

    return {
        authToken,
        setAuthToken,
        clearAuthToken,
        hasAuthToken: !!authToken
    };
}