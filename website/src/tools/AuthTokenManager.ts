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

export function useAuthToken(url: string | undefined) {
    // Always call hooks at the top level, regardless of conditions
    const [ authToken, setTokenState] = useState<string | null>(() => {
        return url ? (tokenStore.get(url) || null) : null;
    });

    const setAuthToken = useCallback(async (token: string) => {
        if (url) {
            tokenStore.set(url, token);
            setTokenState(token);
        }
    }, [url]);

    const clearAuthToken = useCallback(async () => {
        if (url) {
            tokenStore.delete(url);
            setTokenState(null);
        }
    }, [url]);

    /*
    const refreshToken = useCallback(async () => {
        const currentToken = await getAuthToken(url);
        setTokenState(currentToken);
        return currentToken;
    }, [url]);
    */

    // Handle the case where url is undefined after hooks are called
    if( !url ) {
        return {
            authToken: null,
            setAuthToken: () => {},
            clearAuthToken: () => {},
            hasAuthToken: false
        };
    }

    return {
        authToken,
        setAuthToken,
        clearAuthToken,
        hasAuthToken: !!authToken
    };
}