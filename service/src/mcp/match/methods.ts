import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { storeValue, getValue } from '../../cache/redis';
import { jrpcResult, jrpcError } from '../../json-rpc';
import { mcpTextContentResponse } from '../utils';
import { MCP_TOOLS } from './tools';
import { ClientAgentSession } from '@agentic-profile/auth';

export async function handleToolsList(request: JSONRPCRequest): Promise<JSONRPCResponse> {
    return jrpcResult(request.id!, { tools: MCP_TOOLS } ) as JSONRPCResponse;
}

export async function handleToolsCall(request: JSONRPCRequest, session: ClientAgentSession): Promise<JSONRPCResponse | JSONRPCError> {
    const { name, arguments: args } = request.params || {};

    console.log('🔍 handleToolsCall', name, session);
    
    switch (name) {
        case 'add':
            return await handleBusinessAdd(request, args);
        case 'find':
            return await handleBusinessFind(request, args);
        default:
            return jrpcError(request.id!, -32601, `Tool ${name} not found`);
    }
}

export async function handleBusinessAdd(request: JSONRPCRequest, args: any): Promise<JSONRPCResponse | JSONRPCError> {
    const { business } = args;
    
    if (!business) {
        return jrpcError(request.id!, -32602, 'Invalid params: business object is required');
    }
    
    const { name, description, location, category, contact } = business;
    
    // Validate required fields
    if (!name || !description || !location || !category) {
        return jrpcError(request.id!, -32602, 'Invalid params: name, description, location, and category are required');
    }
    
    const { latitude, longitude, address } = location;
    if (typeof latitude !== 'number' || typeof longitude !== 'number' || !address) {
        return jrpcError(request.id!, -32602, 'Invalid params: location must have valid latitude, longitude, and address');
    }

    // Generate a unique business ID
    const businessId = `business:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    
    const businessData = {
        id: businessId,
        name,
        description,
        location: {
            latitude,
            longitude,
            address
        },
        category,
        contact: contact || {},
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    };

    // Store the business data
    try {
        await storeValue(businessId, businessData);
        
        // Also store in category index for easier searching
        const categoryKey = `category:${category}`;
        const existingBusinesses = await getValue(categoryKey) || [];
        existingBusinesses.push(businessId);
        await storeValue(categoryKey, existingBusinesses);
        
        console.log('✅ Business added successfully:', businessId);
        return mcpTextContentResponse(request.id!, `Business "${name}" added successfully with ID: ${businessId}`);
    } catch (error) {
        console.log('❌ Failed to add business:', error);
        return jrpcError(request.id!, -32603, 'Failed to store business data: ' + (error as Error).message);
    }
}

export async function handleBusinessFind(request: JSONRPCRequest, args: any): Promise<JSONRPCResponse | JSONRPCError> {
    const { criteria } = args;
    
    if (!criteria) {
        return jrpcError(request.id!, -32602, 'Invalid params: criteria object is required');
    }
    
    const { category, location, name } = criteria;
    
    try {
        let businessIds: string[] = [];
        
        // Search by category if specified
        if (category) {
            const categoryKey = `category:${category}`;
            const categoryBusinesses = await getValue(categoryKey) || [];
            businessIds = [...categoryBusinesses];
        }
        
        // If no category specified, get all businesses (this is a simplified approach)
        if (!category) {
            // In a real implementation, you'd have an index of all businesses
            // For now, we'll search through some common categories
            const commonCategories = ['restaurant', 'retail', 'service', 'healthcare', 'entertainment'];
            for (const cat of commonCategories) {
                const categoryKey = `category:${cat}`;
                const categoryBusinesses = await getValue(categoryKey) || [];
                businessIds = [...businessIds, ...categoryBusinesses];
            }
        }
        
        // Remove duplicates
        businessIds = [...new Set(businessIds)];
        
        // Get business details
        const businesses = [];
        for (const businessId of businessIds) {
            const businessData = await getValue(businessId);
            if (businessData) {
                // Filter by name if specified
                if (name && !businessData.name.toLowerCase().includes(name.toLowerCase())) {
                    continue;
                }
                
                // Filter by location if specified
                if (location && location.latitude && location.longitude && location.radius) {
                    const distance = calculateDistance(
                        location.latitude,
                        location.longitude,
                        businessData.location.latitude,
                        businessData.location.longitude
                    );
                    
                    if (distance > location.radius) {
                        continue;
                    }
                }
                
                businesses.push(businessData);
            }
        }
        
        if (businesses.length === 0) {
            return mcpTextContentResponse(request.id!, 'No businesses found matching the criteria');
        }
        
        const result = businesses.map(b => ({
            name: b.name,
            description: b.description,
            category: b.category,
            location: b.location,
            contact: b.contact
        }));
        
        return mcpTextContentResponse(request.id!, `Found ${businesses.length} businesses:\n${JSON.stringify(result, null, 2)}`);
        
    } catch (error) {
        console.log('❌ Failed to find businesses:', error);
        return jrpcError(request.id!, -32603, 'Failed to search businesses: ' + (error as Error).message);
    }
}

// Helper function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}
