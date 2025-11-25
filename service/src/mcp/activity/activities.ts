import activityData from './activities.json' with { type: 'json' };

export const activities = simplifyActivities(activityData);
console.log('🔍 activities', activities.length );


//
// Convert MongoDB objects to simpler objects for the MCP
//

function simplifyActivities(activities: any[]): any[] {
    return activities.map(simplifyActivity);
}

function simplifyActivity(activity: any): any {
    const result = simplifyObject(activity);
    result.postcode = resolvePostcodeFromActivity(activity);
    result.fulltext = buildFulltext(activity);
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

    //if( postcode )
    //    console.log('🔍 postcode', postcode, activity.id );
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

export function buildFulltext( activity: any ): string[] {
    const fulltext = new Set<string>();

    addKeywords( fulltext, activity.address?.street );

    const adsd = activity.activityDefinitionSubDocument;
    addKeywords( fulltext, adsd?.fullAddress?.street );
    addKeywords( fulltext, adsd?.title );
    addKeywords( fulltext, adsd?.description );

    let causeOptions = adsd?.causeOptions;
    if( causeOptions ) {
        for( const causeOption of causeOptions ) {
            addKeywords( fulltext, causeOption?.displayName );
        }
    }

    const osd = activity.organizationSubDocument;
    addKeywords( fulltext, osd?.name );
    addKeywords( fulltext, osd?.description );
    addKeywords( fulltext, osd?.purpose );
    addKeywords( fulltext, osd?.fullAddress?.street );

    causeOptions = osd?.causeOptions;
    if( causeOptions ) {
        for( const causeOption of causeOptions ) {
            addKeywords( fulltext, causeOption?.displayName );
        }
    }
    
    const appSummary = activity.appSummary
    addKeywords( fulltext, appSummary?.name );
    addKeywords( fulltext, appSummary?.description );

    return Array.from(fulltext);
}

function addKeywords( fulltext: Set<string>, text: string | undefined ) {
    if( !text )
        return;
    const keywords = text.toLowerCase().split(/\s+/);
    for( const keyword of keywords ) {
        fulltext.add(cleanKeyword(keyword));
    }
}

function cleanKeyword( keyword: string ): string {
    return keyword.replace(/[^a-zA-Z0-9_-]/g, '');
}
