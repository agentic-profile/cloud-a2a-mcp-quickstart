import { JSONRPCRequest, JSONRPCResponse, JSONRPCError } from '@modelcontextprotocol/sdk/types.js';
import { mcpResultResponse } from "../misc.js";
import { jrpcError } from '../../json-rpc/index.js';
import { QueryVolunteers, Volunteer } from './types.js';
import { queryVolunteers } from './graphdb/neptune.js';

export async function handleQuery(request: JSONRPCRequest): Promise<JSONRPCResponse | JSONRPCError> {
    const query = request.params?.arguments as QueryVolunteers | undefined;
    if( !query )
        return jrpcError(request.id!, -32602, `Invalid arguments: query is required`);

    let volunteers = await queryVolunteers( buildQuery(query) );
    
    // Apply post-filtering for complex queries that can't be done in Gremlin
    volunteers = filterVolunteers(volunteers, query);

    return mcpResultResponse(request.id!, {
        kind: 'volunteer-list',
        count: volunteers.length,
        volunteers,
        query
    });
}

/**
 * Escape string for use in Gremlin queries
 */
function escapeGremlinString(str: string): string {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/**
 * Build a Gremlin query from QueryVolunteers parameters
 * Uses basic Gremlin filters that work with Neptune.
 * Complex filtering (age ranges, JSON field matching) is done in filterVolunteers()
 */
function buildQuery(query: QueryVolunteers): string {
    let queryString = 'g.V().hasLabel("Volunteer")';

    // Postcode - exact match (can be done in Gremlin)
    if (query.postcode) {
        queryString += `.has("postcode", "${escapeGremlinString(query.postcode)}")`;
    }

    // Minor - boolean (can be done in Gremlin)
    if (query.minor !== undefined) {
        queryString += `.has("minor", ${query.minor})`;
    }

    // Gender - exact match (can be done in Gremlin)
    if (query.gender) {
        queryString += `.has("gender", "${escapeGremlinString(query.gender)}")`;
    }

    // For other fields, we'll do basic existence checks to narrow results
    // Exact filtering happens in filterVolunteers()
    if (query.minAge !== undefined || query.maxAge !== undefined) {
        queryString += `.has("age")`;
    }

    if (query.languages && query.languages.length > 0) {
        queryString += `.has("languages")`;
    }

    if (query.skills && query.skills.length > 0) {
        queryString += `.has("skills")`;
    }

    if (query.presence || query.causes || query.timeCommitment || 
        query.hourPreferences || query.dayPreferences || 
        query.minDurationHours !== undefined || query.maxDistanceKm !== undefined ||
        query.startDate || query.endDate) {
        queryString += `.has("preferences")`;
    }

    // Add valueMap at the end to get all properties
    queryString += '.valueMap(true)';

    return queryString;
}

/**
 * Check if all values in query array are found in volunteer array
 * @param queryArray - Array from query (may be undefined)
 * @param volunteerArray - Array from volunteer (may be undefined)
 * @returns true if queryArray is undefined, or if every value in queryArray is in volunteerArray
 */
function checkMatches<T>(queryArray: T[] | undefined, volunteerArray: T[] | undefined): boolean {
    if (queryArray === undefined) {
        return true;
    }
    const volunteer = volunteerArray || [];
    return queryArray.every(queryValue => volunteer.includes(queryValue));
}

/**
 * Filter volunteers based on QueryVolunteers criteria
 * Handles complex filtering that can't be done efficiently in Gremlin queries
 */
function filterVolunteers(volunteers: Volunteer[], query: QueryVolunteers): Volunteer[] {
    return volunteers.filter(volunteer => {
        // Keywords - split into words and check each word appears in any target property
        if (query.keywords) {
            const keywordWords = query.keywords
                .toLowerCase()
                .replace(/[^\w\s]/g, ' ') // Remove symbols, replace with space
                .split(/\s+/)
                .filter(word => word.length > 0);
            
            if (keywordWords.length > 0) {
                const nameLower = volunteer.name?.toLowerCase() || '';
                const descLower = volunteer.description?.toLowerCase() || '';
                const skillsLower = (volunteer.skills || []).join(' ').toLowerCase();
                const causesLower = (volunteer.preferences?.causes || []).join(' ').toLowerCase();
                
                // Combine all searchable text
                const searchableText = `${nameLower} ${descLower} ${skillsLower} ${causesLower}`;
                
                // Each keyword word must appear in at least one target property
                const allWordsFound = keywordWords.every(word => 
                    searchableText.includes(word)
                );
                
                if (!allWordsFound) {
                    return false;
                }
            }
        }

        // Age range
        if (query.minAge !== undefined && (volunteer.age === undefined || volunteer.age < query.minAge)) {
            return false;
        }
        if (query.maxAge !== undefined && (volunteer.age === undefined || volunteer.age > query.maxAge)) {
            return false;
        }

        // Languages
        if (!checkMatches(query.languages, volunteer.languages)) {
            return false;
        }

        // Skills
        if (!checkMatches(query.skills, volunteer.skills)) {
            return false;
        }

        // Preferences-based filtering
        const { presence, causes, times, dates, maxDistanceKm } = volunteer.preferences ?? {};

        // Presence
        if (!checkMatches(query.presence, presence)) {
            return false;
        }

        // Causes
        if (!checkMatches(query.causes, causes)) {
            return false;
        }

        // Time preferences

        // Time commitment
        if( query.timeCommitment ) {
            if( !times?.commitment || times.commitment !== query.timeCommitment) {
                return false;
            }
        }

        // Hour preferences
        if (!checkMatches(query.hourPreferences, times?.hours)) {
            return false;
        }

        // Day preferences
        if (!checkMatches(query.dayPreferences, times?.days)) {
            return false;
        }

        // Min duration hours
        if (query.minDurationHours !== undefined) {
            const volunteerDuration = times?.maxDurationHours;
            if (volunteerDuration === undefined || volunteerDuration < query.minDurationHours) {
                return false;
            }
        }

        // Max distance
        if (query.maxDistanceKm !== undefined) {
            const volunteerMaxDistance = maxDistanceKm;
            if (volunteerMaxDistance === undefined || volunteerMaxDistance < query.maxDistanceKm) {
                return false;
            }
        }

        // Date range - check if volunteer has availability in the specified date range
        if (query.startDate || query.endDate) {
            const volunteerDates = dates || [];
            if (volunteerDates.length === 0) {
                return false; // No availability dates
            }
            
            const startDate = query.startDate ? new Date(query.startDate) : null;
            const endDate = query.endDate ? new Date(query.endDate) : null;
            
            const hasOverlappingDate = volunteerDates.every(dateRange => {
                const rangeStart = new Date(dateRange.startDate);
                const rangeEnd = new Date(dateRange.endDate);
                
                // Check if the query date range overlaps with volunteer's availability
                if (startDate && endDate) {
                    return rangeStart <= endDate && rangeEnd >= startDate;
                } else if (startDate) {
                    return rangeEnd >= startDate;
                } else if (endDate) {
                    return rangeStart <= endDate;
                }
                return true;
            });
            
            if (!hasOverlappingDate) {
                return false;
            }
        }

        return true;
    });
}
   