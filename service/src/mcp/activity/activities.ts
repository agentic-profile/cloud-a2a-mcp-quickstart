import { CoreActivity, Geolocation } from './types.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Read and process data in an IIFE to allow original data to be garbage collected after processing
export const activities = (() => {
    console.time("Import activities");
    // Read JSON file directly so it can be garbage collected after processing
    const activityDataPath = join(__dirname, 'data', 'activities.json');
    const activityData: any[] = JSON.parse(readFileSync(activityDataPath, 'utf-8'));
    const processed = simplifyDoitActivities(activityData);
    console.timeEnd("Import activities");
    appendTeamKineticActivities(processed);

    return processed;
})();
console.log('🔍 activities', activities.length );


//
// Team Kinetic activity data
//

function appendTeamKineticActivities(activities: any[]) {
    // Read CSV file using readFileSync (import doesn't support CSV/TXT files)
    const csvPath = join(__dirname, 'data', 'odi-opp-data.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    const csvRows = parseCSV(csvContent);
    
    // Skip header row and process data rows
    csvRows.slice(1).forEach((row) => {
        const [ id, name, description, tags, _locationType, location, city, postcode, _oppType, externalApplyLink, start, end ] = row;
        
        const fulltext = new Set<string>();
        addKeywords(fulltext, name);
        addKeywords(fulltext, description);
        addKeywords(fulltext, tags);
        addKeywords(fulltext, location);
        addKeywords(fulltext, city);
        addKeywords(fulltext, postcode);

        // Create activity object
        const result: CoreActivity = {
            kind: 'odi-activity',
            source: {
                kind: 'teamkinetic-activity',
                author: 'teamkinetic',
                id,
            },
            index: {
                fulltext: Array.from(fulltext)
            },

            activity: id,
            id,

            title: name,
            description,
            //locationOption: locationType,
            //cause: tags,
            //type: oppType,
            start,
            end,
            address: `${location}, ${city}`,
            postcode,

            externalApplyLink
        }
        
        activities.push(result);
    });
}

// Simple CSV parser that handles quoted fields
function parseCSV(content: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < content.length; i++) {
        const char = content[i];
        const nextChar = content[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                currentField += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            currentRow.push(currentField.trim());
            currentField = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            // End of row
            if (currentField || currentRow.length > 0) {
                currentRow.push(currentField.trim());
                rows.push(currentRow);
                currentRow = [];
                currentField = '';
            }
            // Skip \r\n combination
            if (char === '\r' && nextChar === '\n') {
                i++;
            }
        } else {
            currentField += char;
        }
    }
    
    // Handle last field/row if file doesn't end with newline
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
    }
    
    return rows;
}

//
// Do IT activity data
//

function simplifyDoitActivities(activities: any[]): any[] {
    return activities.map(simplifyDoitActivity);
}

export function simplifyDoitActivity(activity: any): any {
    const doitActivity = simplifyObject(activity);
    const { fields, fulltext } = buildFulltext(doitActivity);
    const postcode = resolvePostcodeFromActivity(doitActivity);
    const geolocation = resolveGeolocation(doitActivity);

    const result = {
        kind: 'odi-activity',
        source: {
            kind: 'doit-activity',
            ...doitActivity,
        },
        index: {
            fulltext
        },
        postcode,
        activity: doitActivity.id,
        id: doitActivity.id,
        createdAt: doitActivity.createdAt,
        updatedAt: doitActivity.updatedAt,
        ...fields,
        ...(geolocation ?? {}),
        externalApplyLink: doitActivity.externalApplyLink,
    } as CoreActivity;

    return result;
}

function simplifyObject(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }
    
    // If it's an object with a $oid property, replace with the value
    if (typeof obj === 'object' && !Array.isArray(obj) && obj.$oid !== undefined) {
        return obj.$oid;
    }
    
    // If it's an object with a $date property, replace with the value
    if (typeof obj === 'object' && !Array.isArray(obj) && obj.$date !== undefined) {
        return obj.$date;
    }
    
    // If it's an array, recursively process each element
    if (Array.isArray(obj)) {
        return obj.map(item => simplifyObject(item));
    }
    
    // If it's a plain object, recursively process all properties
    if (typeof obj === 'object') {
        const simplified: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // Rename _id to id
                const newKey = key === '_id' ? 'id' : key;
                simplified[newKey] = simplifyObject(obj[key]);
            }
        }
        return simplified;
    }
    
    // For primitives, return as-is
    return obj;
}

function resolvePostcodeFromActivity( activity: any ): string | undefined {
    let postcode = resolvePostcodeFromStreet( activity.address?.street );
    if( !postcode )
        postcode = resolvePostcodeFromStreet( activity.organizationSubDocument?.fullAddress?.street );

    return postcode;
}

function resolvePostcodeFromStreet( street: string ): string | undefined {
    // UK postcode pattern: 1-2 letters, 1-2 numbers, optional space, 1 number, 2 letters
    // Examples: E1 3DG, SW2 1RW, EX32 7EU, CO1 2SL, B3 1DG, NE63 9UJ
    const ukPostcodeRegex = /\b([A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2})\b/;
    const match = street?.match(ukPostcodeRegex);
    if( match )
        return match[1].trim();
    else
        return undefined;
}

export function buildFulltext( activity: any ): { fields: any, fulltext: string[] } {
    const fulltext = new Set<string>();
    const fields: any = {};

    addKeywords( fulltext, activity.address?.street, fields, 'address' );

    // Process organization fields first, so they can be replaced by more specific app and activity field values
    const osd = activity.organizationSubDocument;
    addKeywords( fulltext, osd?.name );
    addKeywords( fulltext, osd?.description, fields, 'description' );
    addKeywords( fulltext, osd?.purpose );
    addKeywords( fulltext, osd?.fullAddress?.street, fields, 'address' );

    let causeOptions = osd?.causeOptions;
    if( causeOptions ) {
        fields.cause = [];
        for( const causeOption of causeOptions ) {
            addKeywords( fulltext, causeOption?.displayName );
            fields.cause.push( causeOption?.displayName );
        }
    }
    
    const appSummary = activity.appSummary
    addKeywords( fulltext, appSummary?.name );
    addKeywords( fulltext, appSummary?.description, fields, 'description' );

    // Activity Definition Sub Document has highest priority for fields
    const adsd = activity.activityDefinitionSubDocument;
    addKeywords( fulltext, adsd?.fullAddress?.street, fields, 'address' );
    addKeywords( fulltext, adsd?.title, fields, 'title' );
    addKeywords( fulltext, adsd?.description, fields, 'description' );
    addKeywords( fulltext, adsd?.attendanceType, fields, 'attendanceType' );
    addKeywords( fulltext, adsd?.type, fields, 'type' );

    causeOptions = adsd?.causeOptions;
    if( causeOptions ) {
        if( !fields.cause )
            fields.cause = [];
        for( const causeOption of causeOptions ) {
            addKeywords( fulltext, causeOption?.displayName );
            fields.cause.push( causeOption?.displayName );
        }
    }

    return { fields, fulltext: Array.from(fulltext) };
}

function addKeywords( fulltext: Set<string>, text: string | undefined, fields?: any, name?: string ) {
    if( !text )
        return;

    if( fields && name )
        fields[name] = text;

    const keywords = text.toLowerCase().split(/\s+/);
    for( const keyword of keywords ) {
        fulltext.add(cleanKeyword(keyword));
    }
}

function cleanKeyword( keyword: string ): string {
    return keyword.replace(/[^a-zA-Z0-9_-]/g, '');
}

function resolveGeolocation( activity: any ): Geolocation | undefined {
    let location = resolveGeolocationFromAddress( activity.address );
    if( location ) {
        return location;
    }

    location = resolveGeolocationFromAddress( activity.organizationSubDocument?.fullAddress );
    if( location )
        return location;

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
