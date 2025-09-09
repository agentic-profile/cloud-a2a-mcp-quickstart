

export function mcpToolsCallRequestInit( name: string, params: any = {}) {
    const mcpRequest = {
        //jsonrpc: "2.0",
        //id: 1,
        method: "tools/call",
        params: {
            ...params,
            name,
        }
    };

    const request: RequestInit = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(mcpRequest),
    };

    return request;
}