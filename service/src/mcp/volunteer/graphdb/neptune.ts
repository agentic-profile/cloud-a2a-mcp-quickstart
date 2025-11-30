import { NeptunedataClient, ExecuteGremlinQueryCommand } from '@aws-sdk/client-neptunedata';
import { Volunteer, Preferences, VolunteeringHistory } from '../types.js';

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
 * Convert value to Gremlin literal (for single values only, not arrays)
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
 * Add a property to a Gremlin query, handling arrays by adding each element separately
 * Returns the query string with property calls appended
 */
function addProperty(query: string, key: string, value: any): string {
    if (value === null || value === undefined) {
        return query;
    }
    
    // Handle arrays: add each element as a separate property value
    if (Array.isArray(value)) {
        for (const item of value) {
            if (typeof item === 'string') {
                query += `.property('${escapeGremlinString(key)}', '${escapeGremlinString(item)}')`;
            } else if (typeof item === 'number' || typeof item === 'boolean') {
                query += `.property('${escapeGremlinString(key)}', ${String(item)})`;
            } else {
                // For complex objects in arrays, serialize to JSON string
                query += `.property('${escapeGremlinString(key)}', '${escapeGremlinString(JSON.stringify(item))}')`;
            }
        }
        return query;
    }
    
    // Single value
    query += `.property('${escapeGremlinString(key)}', ${toGremlinValue(value)})`;
    return query;
}

/**
 * Flatten preferences object into individual properties for graph storage
 * Returns an object with property names and values to be set on the vertex
 */
function flattenPreferences(preferences: Preferences): Record<string, any> {
    const props: Record<string, any> = {};
    
    if (preferences.maxDistanceKm !== undefined) {
        props['preferences.maxDistanceKm'] = preferences.maxDistanceKm;
    }
    
    if (preferences.causes && preferences.causes.length > 0) {
        props['preferences.causes'] = preferences.causes;
    }
    
    if (preferences.presence && preferences.presence.length > 0) {
        props['preferences.presence'] = preferences.presence;
    }
    
    if (preferences.times) {
        if (preferences.times.hours && preferences.times.hours.length > 0) {
            props['preferences.times.hours'] = preferences.times.hours;
        }
        if (preferences.times.days && preferences.times.days.length > 0) {
            props['preferences.times.days'] = preferences.times.days;
        }
        if (preferences.times.maxDurationHours !== undefined) {
            props['preferences.times.maxDurationHours'] = preferences.times.maxDurationHours;
        }
        if (preferences.times.commitment) {
            props['preferences.times.commitment'] = preferences.times.commitment;
        }
    }
    
    if (preferences.dates && preferences.dates.length > 0) {
        // Store dates as separate arrays for start and end dates
        const startDates: string[] = [];
        const endDates: string[] = [];
        for (const dateRange of preferences.dates) {
            startDates.push(dateRange.startDate);
            endDates.push(dateRange.endDate);
        }
        props['preferences.dates.startDates'] = startDates;
        props['preferences.dates.endDates'] = endDates;
    }
    
    return props;
}

/**
 * Flatten history object into individual properties for graph storage
 * Returns an object with property names and values to be set on the vertex
 */
function flattenHistory(history: VolunteeringHistory): Record<string, any> {
    const props: Record<string, any> = {};
    
    if (history.since !== undefined) {
        props['history.since'] = history.since;
    }
    
    if (history.activities !== undefined) {
        props['history.activities'] = history.activities;
    }
    
    if (history.organizations && history.organizations.length > 0) {
        props['history.organizations'] = history.organizations;
    }
    
    return props;
}

/**
 * Reconstruct preferences object from flattened graph properties
 */
function reconstructPreferences(props: Record<string, any>): Preferences | undefined {
    const preferences: Preferences = {};
    let hasPreferences = false;
    
    if (props['preferences.maxDistanceKm'] !== undefined) {
        preferences.maxDistanceKm = typeof props['preferences.maxDistanceKm'] === 'string' 
            ? parseFloat(props['preferences.maxDistanceKm']) 
            : props['preferences.maxDistanceKm'];
        hasPreferences = true;
    }
    
    if (props['preferences.causes']) {
        preferences.causes = props['preferences.causes'];
        hasPreferences = true;
    }
    
    if (props['preferences.presence']) {
        preferences.presence = props['preferences.presence'];
        hasPreferences = true;
    }
    
    // Reconstruct times
    const times: any = {};
    if (props['preferences.times.hours']) {
        times.hours = props['preferences.times.hours'];
        hasPreferences = true;
    }
    if (props['preferences.times.days']) {
        times.days = props['preferences.times.days'];
        hasPreferences = true;
    }
    if (props['preferences.times.maxDurationHours'] !== undefined) {
        times.maxDurationHours = typeof props['preferences.times.maxDurationHours'] === 'string'
            ? parseInt(props['preferences.times.maxDurationHours'], 10)
            : props['preferences.times.maxDurationHours'];
        hasPreferences = true;
    }
    if (props['preferences.times.commitment']) {
        times.commitment = props['preferences.times.commitment'];
        hasPreferences = true;
    }
    if (Object.keys(times).length > 0) {
        preferences.times = times;
    }
    
    // Reconstruct dates from separate arrays
    if (props['preferences.dates.startDates'] && props['preferences.dates.endDates']) {
        const startDates = props['preferences.dates.startDates'];
        const endDates = props['preferences.dates.endDates'];
        if (Array.isArray(startDates) && Array.isArray(endDates) && startDates.length === endDates.length) {
            preferences.dates = startDates.map((startDate: string, index: number) => ({
                startDate,
                endDate: endDates[index]
            }));
            hasPreferences = true;
        }
    }
    
    return hasPreferences ? preferences : undefined;
}

/**
 * Reconstruct history object from flattened graph properties
 */
function reconstructHistory(props: Record<string, any>): VolunteeringHistory | undefined {
    const history: VolunteeringHistory = {};
    let hasHistory = false;
    
    if (props['history.since'] !== undefined) {
        history.since = props['history.since'];
        hasHistory = true;
    }
    
    if (props['history.activities'] !== undefined) {
        history.activities = typeof props['history.activities'] === 'string' 
            ? parseInt(props['history.activities'], 10) 
            : props['history.activities'];
        hasHistory = true;
    }
    
    if (props['history.organizations']) {
        history.organizations = props['history.organizations'];
        hasHistory = true;
    }
    
    return hasHistory ? history : undefined;
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
        query += `unfold()`;
        query = addProperty(query, 'name', volunteer.name);
        query = addProperty(query, 'updatedAt', volunteer.updatedAt);
        
        if (volunteer.description) {
            query = addProperty(query, 'description', volunteer.description);
        }
        if (volunteer.postcode) {
            query = addProperty(query, 'postcode', volunteer.postcode);
        }
        if (volunteer.skills && volunteer.skills.length > 0) {
            query = addProperty(query, 'skills', volunteer.skills);
        }
        // Flatten preferences into individual properties
        if (volunteer.preferences) {
            const prefProps = flattenPreferences(volunteer.preferences);
            for (const [key, value] of Object.entries(prefProps)) {
                query = addProperty(query, key, value);
            }
        }
        if (volunteer.age !== undefined) {
            query = addProperty(query, 'age', volunteer.age);
        }
        if (volunteer.minor !== undefined) {
            query = addProperty(query, 'minor', volunteer.minor);
        }
        if (volunteer.gender) {
            query = addProperty(query, 'gender', volunteer.gender);
        }
        if (volunteer.languages && volunteer.languages.length > 0) {
            query = addProperty(query, 'languages', volunteer.languages);
        }
        // Flatten history into individual properties
        if (volunteer.history) {
            const historyProps = flattenHistory(volunteer.history);
            for (const [key, value] of Object.entries(historyProps)) {
                query = addProperty(query, key, value);
            }
        }
        
        // If not found, create new vertex
        query += `, addV('Volunteer')`;
        query = addProperty(query, 'did', did);
        query = addProperty(query, 'name', volunteer.name);
        query = addProperty(query, 'createdAt', volunteer.createdAt);
        query = addProperty(query, 'updatedAt', volunteer.updatedAt);
        
        if (volunteer.description) {
            query = addProperty(query, 'description', volunteer.description);
        }
        if (volunteer.postcode) {
            query = addProperty(query, 'postcode', volunteer.postcode);
        }
        if (volunteer.skills && volunteer.skills.length > 0) {
            query = addProperty(query, 'skills', volunteer.skills);
        }
        // Flatten preferences into individual properties
        if (volunteer.preferences) {
            const prefProps = flattenPreferences(volunteer.preferences);
            for (const [key, value] of Object.entries(prefProps)) {
                query = addProperty(query, key, value);
            }
        }
        if (volunteer.age !== undefined) {
            query = addProperty(query, 'age', volunteer.age);
        }
        if (volunteer.minor !== undefined) {
            query = addProperty(query, 'minor', volunteer.minor);
        }
        if (volunteer.gender) {
            query = addProperty(query, 'gender', volunteer.gender);
        }
        if (volunteer.languages && volunteer.languages.length > 0) {
            query = addProperty(query, 'languages', volunteer.languages);
        }
        // Flatten history into individual properties
        if (volunteer.history) {
            const historyProps = flattenHistory(volunteer.history);
            for (const [key, value] of Object.entries(historyProps)) {
                query = addProperty(query, key, value);
            }
        }
        
        query += `)`;

        await executeGremlinQuery(query);
    } catch (error) {
        console.error('Error updating volunteer in Neptune:', error);
        throw error;
    }
}

/**
 * Extract the actual value from a Gremlin type object
 * Handles types like g:Int32, g:Int64, g:Boolean, g:Double, etc.
 */
function extractGremlinValue(value: any): any {
    if (value && typeof value === 'object' && value['@type'] && value['@value'] !== undefined) {
        const gremlinType = value['@type'];
        const gremlinValue = value['@value'];
        
        // Extract the actual value from Gremlin types
        if (gremlinType === 'g:Int32' || gremlinType === 'g:Int64' || gremlinType === 'g:Double') {
            return typeof gremlinValue === 'string' ? parseFloat(gremlinValue) : gremlinValue;
        }
        if (gremlinType === 'g:Boolean') {
            return typeof gremlinValue === 'string' ? gremlinValue === 'true' : gremlinValue;
        }
        // For other types, return the value as-is
        return gremlinValue;
    }
    return value;
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
                // Properties that should be arrays: extract all values
                const arrayProperties = [
                    'skills', 
                    'languages',
                    'preferences.causes',
                    'preferences.presence',
                    'preferences.times.hours',
                    'preferences.times.days',
                    'preferences.dates.startDates',
                    'preferences.dates.endDates',
                    'history.organizations'
                ];
                if (arrayProperties.includes(key) && listValues.length > 0) {
                    // Extract all values from the list for array properties
                    result[key] = listValues.map(v => extractGremlinValue(v));
                } else if (listValues.length > 0) {
                    // For single-value properties, take the first value
                    result[key] = extractGremlinValue(listValues[0]);
                }
            } else {
                // Extract the actual value from Gremlin types
                result[key] = extractGremlinValue(value);
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
    
    // Array properties (stored as Gremlin lists)
    if (props.skills) {
        volunteer.skills = props.skills;
    }
    
    // Reconstruct preferences from flattened graph properties
    const preferences = reconstructPreferences(props);
    if (preferences) {
        volunteer.preferences = preferences;
    }
    
    if (props.age !== undefined) {
        // Handle both Gremlin types and plain numbers/strings
        if (typeof props.age === 'object' && props.age['@type'] && props.age['@value'] !== undefined) {
            volunteer.age = extractGremlinValue(props.age);
        } else {
            volunteer.age = typeof props.age === 'string' ? parseInt(props.age, 10) : props.age;
        }
    }
    if (props.minor !== undefined) {
        // Handle both Gremlin types and plain booleans/strings
        if (typeof props.minor === 'object' && props.minor['@type'] && props.minor['@value'] !== undefined) {
            volunteer.minor = extractGremlinValue(props.minor);
        } else {
            volunteer.minor = typeof props.minor === 'string' ? props.minor === 'true' : props.minor;
        }
    }
    if (props.gender) {
        volunteer.gender = props.gender;
    }
    if (props.languages) {
        volunteer.languages = props.languages;
    }
    
    // Reconstruct history from flattened graph properties
    const history = reconstructHistory(props);
    if (history) {
        volunteer.history = history;
    }
    
    return volunteer as Volunteer;
}

const LIST_QUERY = 'g.V().hasLabel("Volunteer").valueMap(true)';

export async function queryVolunteers( query: string = LIST_QUERY ): Promise<Volunteer[]> {
    try {
        const response = await executeGremlinQuery(query);

        console.log('🔍 Neptune listVolunteers response:', JSON.stringify(response, null, 2));
        
        const vertices = extractVerticesFromResponse(response);

        console.log('🔍 Neptune listVolunteers vertices:', JSON.stringify(vertices, null, 2));
        
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