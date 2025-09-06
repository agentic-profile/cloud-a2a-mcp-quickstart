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