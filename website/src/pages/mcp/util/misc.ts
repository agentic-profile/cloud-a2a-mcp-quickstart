export function mcpToolsCallRequestInit2( name: string, args: any = {}) {

    return mcpMethodRequestInit("tools/call", {
        name,
        arguments: args
    });
}

export function mcpMethodRequestInit( method: string, params: any = {}) {
    const mcpRequest = {
        //jsonrpc: "2.0",
        //id: 1,
        method,
        params
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