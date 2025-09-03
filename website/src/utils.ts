
export function buildEndpoint(serverUrl: string, path: string) {
    if( !serverUrl.endsWith('/') ) {
        serverUrl += '/';
    }
    return new URL(path, serverUrl).toString();
}