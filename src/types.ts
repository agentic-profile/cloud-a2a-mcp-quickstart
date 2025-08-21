export interface JsonRPCRequest {
    jsonrpc: string;
    id: string | number;
    method: string;
    params?: any;
}

export interface JsonRPCResponse {
    jsonrpc: string;
    id: string | number;
    result?: any;
    error?: {
        code: number;
        message: string;
        data?: any;
    };
} 