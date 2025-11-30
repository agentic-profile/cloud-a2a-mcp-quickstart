import { NeptunedataClient, ExecuteGremlinQueryCommand } from '@aws-sdk/client-neptunedata';
import { Volunteer } from '../types.js';

// Neptune configuration from environment variables (provided by agentic-service.yaml)
// These are set in the Lambda function environment from CloudFormation template
const NEPTUNE_CLUSTER_ENDPOINT = process.env.NEPTUNE_CLUSTER_ENDPOINT || '';
const NEPTUNE_CLUSTER_PORT = parseInt(process.env.NEPTUNE_CLUSTER_PORT || '8182', 10);
const AWS_REGION = process.env.AWS_REGION || 'us-west-2';

// Lazy-initialized Neptune client to avoid blocking Lambda cold starts
let neptuneClient: NeptunedataClient | null = null;

/**
 * Get or create the Neptune client (lazy initialization)
 * This prevents network timeouts during Lambda cold start
 */
function getNeptuneClient(): NeptunedataClient {
    if (neptuneClient) {
        return neptuneClient;
    }

    // Validate that endpoint is provided
    if (!NEPTUNE_CLUSTER_ENDPOINT) {
        throw new Error('NEPTUNE_CLUSTER_ENDPOINT environment variable is not set');
    }

    // Log the endpoint for debugging
    console.log(`🔍 Neptune Cluster Endpoint: ${NEPTUNE_CLUSTER_ENDPOINT}:${NEPTUNE_CLUSTER_PORT}`);

    // Initialize Neptune Data client with endpoint from environment variable
    // Construct the full HTTPS endpoint URL from the cluster endpoint
    const neptuneEndpoint = `https://${NEPTUNE_CLUSTER_ENDPOINT}:${NEPTUNE_CLUSTER_PORT}`;

    neptuneClient = new NeptunedataClient({
        endpoint: neptuneEndpoint,
        region: AWS_REGION,
    });

    return neptuneClient;
}

/**
 * Execute a Gremlin query against Neptune using AWS SDK
 */
async function executeGremlinQuery(query: string): Promise<any> {
    try {
        const client = getNeptuneClient();
        const command = new ExecuteGremlinQueryCommand({
            gremlinQuery: query,
        });

        const response = await client.send(command);
        
        // Log response structure for debugging
        //console.log('🔍 Neptune response structure:', JSON.stringify(response, null, 2));
        
        // Neptune Data API returns results - check various possible properties
        const responseAny = response as any;
        
        // The output might be in response.output (Uint8Array) or directly accessible
        if (responseAny.output) {
            // Decode the output from Uint8Array
            const decoder = new TextDecoder('utf-8');
            const decodedOutput = decoder.decode(responseAny.output);
            try {
                // Parse the JSON response
                return JSON.parse(decodedOutput);
            } catch (parseError) {
                // If it's not JSON, return the decoded string
                return decodedOutput;
            }
        }
        
        // Return response as-is
        return responseAny;
    } catch (error) {
        console.error('Error executing Gremlin query:', error);
        throw error;
    }
}

/**
 * Escape string for use in Gremlin queries
 */
function escapeGremlinString(str: string): string {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Convert value to Gremlin literal
 */
function toGremlinValue(value: any): string {
    if (value === null || value === undefined) {
        return 'null';
    }
    if (typeof value === 'string') {
        return `'${escapeGremlinString(value)}'`;
    }
    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }
    // For complex objects, serialize to JSON string
    return `'${escapeGremlinString(JSON.stringify(value))}'`;
}

/**
 * Update or insert a Volunteer into the Neptune database
 * @param volunteer - The volunteer object to insert or update
 * @returns Promise that resolves when the operation completes
 */
export async function updateVolunteer(volunteer: Volunteer): Promise<void> {
    try {
        const did = volunteer.did;
        
        // Use coalesce pattern for upsert: try to update existing, if not found, create new
        let query = `g.V().hasLabel('Volunteer').has('did', '${escapeGremlinString(did)}').fold().coalesce(`;
        query += `unfold().property('name', ${toGremlinValue(volunteer.name)})`;
        query += `.property('updatedAt', ${toGremlinValue(volunteer.updatedAt)})`;
        
        if (volunteer.description) {
            query += `.property('description', ${toGremlinValue(volunteer.description)})`;
        }
        if (volunteer.postcode) {
            query += `.property('postcode', ${toGremlinValue(volunteer.postcode)})`;
        }
        if (volunteer.skills && volunteer.skills.length > 0) {
            query += `.property('skills', ${toGremlinValue(volunteer.skills)})`;
        }
        if (volunteer.preferences) {
            query += `.property('preferences', ${toGremlinValue(volunteer.preferences)})`;
        }
        
        // If not found, create new vertex
        query += `, addV('Volunteer').property('did', '${escapeGremlinString(did)}')`;
        query += `.property('name', ${toGremlinValue(volunteer.name)})`;
        query += `.property('createdAt', ${toGremlinValue(volunteer.createdAt)})`;
        query += `.property('updatedAt', ${toGremlinValue(volunteer.updatedAt)})`;
        
        if (volunteer.description) {
            query += `.property('description', ${toGremlinValue(volunteer.description)})`;
        }
        if (volunteer.postcode) {
            query += `.property('postcode', ${toGremlinValue(volunteer.postcode)})`;
        }
        if (volunteer.skills && volunteer.skills.length > 0) {
            query += `.property('skills', ${toGremlinValue(volunteer.skills)})`;
        }
        if (volunteer.preferences) {
            query += `.property('preferences', ${toGremlinValue(volunteer.preferences)})`;
        }
        
        query += `)`;

        await executeGremlinQuery(query);
    } catch (error) {
        console.error('Error updating volunteer in Neptune:', error);
        throw error;
    }
}

/**
 * Parse a Gremlin Map vertex into a plain object with properties
 * The vertex is in the format: { "@type": "g:Map", "@value": [key1, value1, key2, value2, ...] }
 * Special markers like {"@type": "g:T", "@value": "id"} indicate the ID key
 */
function parseGremlinVertex(vertex: any): Record<string, any> {
    if (!vertex || vertex['@type'] !== 'g:Map' || !Array.isArray(vertex['@value'])) {
        return {};
    }
    
    const result: Record<string, any> = {};
    const mapArray = vertex['@value'];
    
    // Iterate through interleaved key-value pairs
    for (let i = 0; i < mapArray.length; i += 2) {
        const key = mapArray[i];
        const value = mapArray[i + 1];
        
        // Skip if key is a special marker (like {"@type": "g:T", "@value": "id"})
        if (key && typeof key === 'object' && key['@type'] === 'g:T') {
            // The next value is the ID or label value
            const specialKey = key['@value'];
            if (specialKey === 'id') {
                result._id = value;
            } else if (specialKey === 'label') {
                result._label = value;
            }
            continue;
        }
        
        // Regular property key-value pair
        if (typeof key === 'string' && value) {
            // Property values are stored as g:List with @value array
            if (value['@type'] === 'g:List' && Array.isArray(value['@value'])) {
                const listValues = value['@value'];
                // For most properties, take the first value
                // For arrays/JSON strings, we'll parse them
                if (listValues.length > 0) {
                    result[key] = listValues[0];
                }
            } else {
                result[key] = value;
            }
        }
    }
    
    return result;
}

/**
 * Extract vertices from a Neptune response
 * Handles different response formats (wrapped in result.data or direct)
 */
function extractVerticesFromResponse(response: any): any[] {
    if (response?.result?.data) {
        const data = response.result.data;
        if (data['@type'] === 'g:List' && Array.isArray(data['@value'])) {
            return data['@value'];
        } else if (data['@type'] === 'g:Map') {
            return [data];
        }
    } else if (response && typeof response === 'object') {
        // Direct response might be the vertex itself
        if (response['@type'] === 'g:Map') {
            return [response];
        } else if (Array.isArray(response)) {
            return response;
        }
    }
    return [];
}

/**
 * Convert parsed properties from a Gremlin vertex to a Volunteer object
 */
function propsToVolunteer(props: Record<string, any>): Volunteer | null {
    if (!props.did) {
        return null;
    }
    
    const volunteer: any = {
        did: props.did,
        name: props.name || '',
        createdAt: props.createdAt || '',
        updatedAt: props.updatedAt || '',
    };
    
    // Optional fields
    if (props.description) {
        volunteer.description = props.description;
    }
    if (props.postcode) {
        volunteer.postcode = props.postcode;
    }
    
    // Parse JSON strings for complex objects
    if (props.skills) {
        try {
            volunteer.skills = typeof props.skills === 'string' ? JSON.parse(props.skills) : props.skills;
        } catch (e) {
            console.warn('Failed to parse skills JSON:', props.skills, e);
            volunteer.skills = props.skills;
        }
    }
    
    if (props.preferences) {
        try {
            volunteer.preferences = typeof props.preferences === 'string' ? JSON.parse(props.preferences) : props.preferences;
        } catch (e) {
            console.warn('Failed to parse preferences JSON:', props.preferences, e);
            volunteer.preferences = props.preferences;
        }
    }
    
    return volunteer as Volunteer;
}

export async function listVolunteers(): Promise<Volunteer[]> {
    try {
        const query = 'g.V().hasLabel("Volunteer").valueMap(true)';
        const response = await executeGremlinQuery(query);

        console.log('🔍 Neptune listVolunteers response:', JSON.stringify(response, null, 2));
        
        const vertices = extractVerticesFromResponse(response);
        
        if (vertices.length === 0) {
            // Check if this was expected to be a list response
            if (response.result?.data?.['@type'] !== 'g:List') {
                throw new Error(`Unexpected response format: expected g:List, got ${response.result?.data?.['@type']}`);
            }
            return [];
        }
        
        // Convert Gremlin vertex format to Volunteer objects
        return vertices
            .map((vertex: any) => {
                const props = parseGremlinVertex(vertex);
                return propsToVolunteer(props);
            })
            .filter((v): v is Volunteer => v !== null && v.did !== '');
    } catch (error) {
        console.error('Error listing volunteers in Neptune:', error);
        throw error;
    }
}

export async function readVolunteer(did: string): Promise<Volunteer | null> {
    try {
        const query = `g.V().hasLabel("Volunteer").has("did", "${escapeGremlinString(did)}").valueMap(true)`;
        const response = await executeGremlinQuery(query);
        
        const vertices = extractVerticesFromResponse(response);
        
        if (vertices.length === 0) {
            return null;
        }
        
        // Take the first vertex (should be only one for a single volunteer query)
        const props = parseGremlinVertex(vertices[0]);
        return propsToVolunteer(props);
    } catch (error) {
        console.error('Error reading volunteer in Neptune:', error);
        throw error;
    }
}

export async function deleteVolunteer(did: string): Promise<void> {
    try {
        const query = `g.V().hasLabel("Volunteer").has("did", "${escapeGremlinString(did)}").drop()`;
        await executeGremlinQuery(query);
    } catch (error) {
        console.error('Error deleting volunteer in Neptune:', error);
        throw error;
    }
}

export async function bulkDeleteVolunteers(limit: number): Promise<void> {
    try {
        const query = `g.V().hasLabel("Volunteer").limit(${limit}).drop()`;
        await executeGremlinQuery(query);
    } catch (error) {
        console.error('Error bulk deleting volunteers in Neptune:', error);
        throw error;
    }
}