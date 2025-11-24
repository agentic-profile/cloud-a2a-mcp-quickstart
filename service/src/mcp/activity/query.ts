import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { mcpResultResponse } from "../misc.js";
import { jrpcError } from '../../json-rpc/index.js';


interface Geolocation {
    latitude: number;
    longitude: number;
}

interface ActivityQuery {
    postcode?: string;
    distance?: number;
    geolocation?: Geolocation;
    locationOption?: 'From Home' | 'Single Location' | 'In Person' | 'Multiple Locations';
    //timeCommitment?: 'One Time' | 'Weekly' | 'Monthly' | 'Flexible';
}

export async function handleQuery(request: JSONRPCRequest,activities:any[]): Promise<JSONRPCResponse | JSONRPCError> {
    const args = request.params?.arguments as { query: ActivityQuery } | undefined;
    if( !args?.query )
        return jrpcError(request.id!, -32602, `Invalid arguments: query is required`);

    const { postcode, geolocation, distance, locationOption, /*timeCommitment*/ } = args.query;
    let results = activities;

    if( postcode ) {
        // activities in a given postcode
        results = results.filter((activity: any) => activity.postcode === postcode);
    }
    
    if( distance && geolocation) {
        // activities within a given distance
        results = results.filter((activity: any) => findDistance(geolocation, resolveGeolocation(activity)) <= distance);
    }

    if( locationOption ) {
        // activities that are remote or in person
        results = results.filter((activity: any) => activity.locationOption === locationOption);
    }

    return mcpResultResponse(request.id!, {
        kind: 'activity-list',
        count: results.length,
        activities: results,
        query: args.query
    });
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

function findDistance( coords1: Geolocation, coords2: Geolocation | undefined): number {
    if( !coords2 )
        return Infinity;
    return calculateDistance(coords1.latitude, coords1.longitude, coords2.latitude, coords2.longitude);
}

function resolveGeolocation( activity: any ): Geolocation | undefined {
    let location = resolveGeolocationFromAddress( activity.organizationSubDocument?.fullAddress );
    if( location )
        return location;

    location = resolveGeolocationFromAddress( activity.address );
    if( location ) {
        return location;
    }

    return undefined;
}

function resolveGeolocationFromAddress( address: any | undefined ): Geolocation | undefined {
    if( !address )
        return undefined;
    let location = address.location;
    if( location.type === 'Point' && location.coordinates.length === 2 ) {
        return {
            latitude: location.coordinates[1],
            longitude: location.coordinates[0]
        }
    }

    return undefined;
}