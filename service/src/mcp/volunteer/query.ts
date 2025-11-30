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
 * Uses Neptune's native filters on flattened properties for efficient querying
 */
function buildQuery(query: QueryVolunteers): string {
    let queryString = 'g.V().hasLabel("Volunteer")';

    // Postcode - exact match
    if (query.postcode) {
        queryString += `.has("postcode", "${escapeGremlinString(query.postcode)}")`;
    }

    // Minor - boolean
    if (query.minor !== undefined) {
        queryString += `.has("minor", ${query.minor})`;
    }

    // Gender - exact match
    if (query.gender) {
        queryString += `.has("gender", "${escapeGremlinString(query.gender)}")`;
    }

    // Age range - use P.gte() and P.lte() predicates
    if (query.minAge !== undefined) {
        queryString += `.has("age", P.gte(${query.minAge}))`;
    }
    if (query.maxAge !== undefined) {
        queryString += `.has("age", P.lte(${query.maxAge}))`;
    }

    // Languages - multi-valued property, check all values match (AND condition)
    // Each .has() call further filters, so chaining them ensures all values are present
    if (query.languages && query.languages.length > 0) {
        for (const lang of query.languages) {
            queryString += `.has("languages", "${escapeGremlinString(lang)}")`;
        }
    }

    // Skills - multi-valued property, check all values match
    if (query.skills && query.skills.length > 0) {
        for (const skill of query.skills) {
            queryString += `.has("skills", "${escapeGremlinString(skill)}")`;
        }
    }

    // Presence - now directly queryable on flattened property, check all values match
    if (query.presence && query.presence.length > 0) {
        for (const pres of query.presence) {
            queryString += `.has("preferences.presence", "${escapeGremlinString(pres)}")`;
        }
    }

    // Causes - directly queryable on flattened property, check all values match
    if (query.causes && query.causes.length > 0) {
        for (const cause of query.causes) {
            queryString += `.has("preferences.causes", "${escapeGremlinString(cause)}")`;
        }
    }

    // Time commitment - directly queryable
    if (query.timeCommitment) {
        queryString += `.has("preferences.times.commitment", "${escapeGremlinString(query.timeCommitment)}")`;
    }

    // Hour preferences - directly queryable, check all values match
    if (query.hourPreferences && query.hourPreferences.length > 0) {
        for (const hour of query.hourPreferences) {
            queryString += `.has("preferences.times.hours", "${escapeGremlinString(hour)}")`;
        }
    }

    // Day preferences - directly queryable, check all values match
    if (query.dayPreferences && query.dayPreferences.length > 0) {
        for (const day of query.dayPreferences) {
            queryString += `.has("preferences.times.days", "${escapeGremlinString(day)}")`;
        }
    }

    // Min duration hours - use P.gte() predicate
    if (query.minDurationHours !== undefined) {
        queryString += `.has("preferences.times.maxDurationHours", P.gte(${query.minDurationHours}))`;
    }

    // Max distance - use P.gte() predicate (volunteer's maxDistanceKm must be >= query's maxDistanceKm)
    if (query.maxDistanceKm !== undefined) {
        queryString += `.has("preferences.maxDistanceKm", P.gte(${query.maxDistanceKm}))`;
    }

    // Date range - check if start/end dates overlap
    // This is complex and may need to be done in memory, but we can at least filter for volunteers with dates
    if (query.startDate || query.endDate) {
        queryString += `.has("preferences.dates.startDates")`;
    }

    // Add valueMap at the end to get all properties
    queryString += '.valueMap(true)';

    console.log('🔍 Built query:', queryString);

    return queryString;
}

/**
 * Filter volunteers based on QueryVolunteers criteria
 * Only handles complex filtering that can't be done efficiently in Gremlin:
 * - Keywords (full-text search across multiple fields)
 * - Date range overlap (complex date logic)
 * 
 * All other filtering (age, skills, languages, presence, causes, etc.) is now done in Gremlin
 */
function filterVolunteers(volunteers: Volunteer[], query: QueryVolunteers): Volunteer[] {
    return volunteers.filter(volunteer => {
        // Keywords - split into words and check each word appears in any target property
        // This requires full-text search which is complex in Gremlin, so we do it in memory
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

        // Date range overlap - complex date logic that's easier to do in memory
        // Gremlin query already filtered for volunteers with dates, now check overlap
        if (query.startDate || query.endDate) {
            const volunteerDates = volunteer.preferences?.dates || [];
            if (volunteerDates.length === 0) {
                return false; // No availability dates
            }
            
            const startDate = query.startDate ? new Date(query.startDate) : null;
            const endDate = query.endDate ? new Date(query.endDate) : null;
            
            // Check if any volunteer date range overlaps with query date range
            const hasOverlappingDate = volunteerDates.some(dateRange => {
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

        // All other filters (age, skills, languages, presence, causes, etc.) are now handled in Gremlin
        return true;
    });
}
   