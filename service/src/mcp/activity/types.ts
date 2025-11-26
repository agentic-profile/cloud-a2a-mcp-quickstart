export interface CoreActivity {
    kind: 'odi-activity';
    source?: Source;
    index?: Index;
    createdAt?: string;
    updatedAt?: string;

    id: string,         // Same as 'activity' field ?!
    activity: string,   // ID

    title?: string,
    description?: string,
    locationOption?: string,
    cause?: string[],
    type?: string,

    start?: string, // ISO 8601 date
    end?: string, // ISO 8601 date

    address?: string,
    postcode?: string,

    latitude?: number,
    longitude?: number,

    externalApplyLink?: string, // URL of web page to apply for the activity
}

export interface ExtendedActivity extends CoreActivity {
    attendees?: number,
    bookings?: number,
    deleted?: boolean,
    ecosystem?: string,
    organisation?: string,
    publishedApps?: string[],

    app?: string, // ID
    measurementUnit?: string,
    due?: string, // ISO 8601 date

    isOnline?: boolean,
    isVolunteerNumberLimited?: boolean,
    meeting?: string, // ID
    volunteers?: number,
    eventType?: string,
    requirement?: string,
    region?: string,
}

export interface Source {
    kind: 'teamkinetic-activity' | 'doit-activity',
    author: string,     // URI, e.g. mailto:mike@example.com or did:web:example.com:mike
    id: string,         // author scoped or global id
    [key: string]: any; // any additional data from the source
}

export interface Index {
    fulltext: string[],
}

export interface Geolocation {
    latitude: number;
    longitude: number;
}
