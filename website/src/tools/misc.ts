import React from 'react';

export const DEFAULT_SERVER_URLS = [
    'https://demo-api.agenticprofile.ai',
    'http://localhost:3000'
];

export function buildEndpoint(serverUrl: string | undefined, path: string | undefined ) {
    if( !serverUrl || !path)
        return undefined;
    else if( !serverUrl.endsWith('/') )
        serverUrl += '/';

    return new URL(path, serverUrl).toString();
}

export function validateHttpUrl(url: string | null | undefined): boolean {
    if (!url?.trim()) return true; // Empty is considered valid
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
};

export function resolveRpcUrl(serverUrl: string, path: string) {
    // Extract rpcUrl from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const rpcUrl = urlParams.get('rpcUrl');
    
    // If no serverUrl, use the path as is
    if (!serverUrl || !rpcUrl)
        return path;

    // Create full URL by combining serverUrl with rpcUrl
    try {
        // Remove trailing slash from serverUrl if present
        const baseUrl = serverUrl.replace(/\/$/, '');

        // Ensure agentUrl starts with a slash
        const path = rpcUrl.startsWith('/') ? rpcUrl : `/${rpcUrl}`;
        const fullUrl = `${baseUrl}${path}`;
        return fullUrl;
    } catch (error) {
        console.error('Error creating full agent URL:', error);
        return null;
    }
}

// Expects a full URL
// Updates the current window's URL with an rpcUrl parameter
export const updateWindowRpcUrl = (rpcUrl: string) => {
    rpcUrl = rpcUrl.trim();

    // Update the URL in browser history without page reload
    const urlParams = new URLSearchParams(window.location.search);
    if( rpcUrl )
        urlParams.set('rpcUrl', rpcUrl);
    else
        urlParams.delete('rpcUrl');
    const newUrlString = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, '', newUrlString);
    
    // Dispatch custom event to notify components of URL change
    window.dispatchEvent(new CustomEvent('urlchange'));
};

export function resolveRpcUrlFromWindow() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('rpcUrl');
}

// Custom hook to reactively track rpcUrl from window URL parameters
export function useRpcUrlFromWindow() {
    const [rpcUrl, setRpcUrl] = React.useState<string | null>(resolveRpcUrlFromWindow());

    React.useEffect(() => {
        const handleUrlChange = () => {
            setRpcUrl(resolveRpcUrlFromWindow());
        };

        // Listen for popstate events (back/forward navigation)
        window.addEventListener('popstate', handleUrlChange);
        
        // Also listen for custom events if needed
        window.addEventListener('urlchange', handleUrlChange);

        return () => {
            window.removeEventListener('popstate', handleUrlChange);
            window.removeEventListener('urlchange', handleUrlChange);
        };
    }, []);

    return rpcUrl;
}