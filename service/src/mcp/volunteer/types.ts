export interface Volunteer {
    did: string,         // did of the volunteer
    createdAt: string;
    updatedAt: string;

    name: string,
    description?: string,
    skills?: Skill[],
    preferences?: Preferences
    postcode?: string,
    age?: number;
    minor?: boolean;
    gender?: Gender;
    languages?: ISO639Language[]; 
}

export type Gender = 'male' | 'female';
export type ISO639Language = 'en' | 'fr' | 'de' | 'it' | 'es' | 'ru' | 'zh' | 'ja' | 'ko' | 'jp';

export interface Preferences {
    times?: TimePreferences;
    dates?: DateRange[];
    maxDistanceKm?: number;
    causes?: Cause[];
    presence: Presence;
}

export type Presence = 'in-person' | 'remote' | 'both';

export type Cause = "Animal welfare"
    | "Community"
    | "Crisis and Welfare"
    | "Emergency Response"
    | "Health and social care"
    | "Older people"
    | "Sports"
    | "Sports, art and culture"
    | "Sustainability, heritage and environment"
    | "Young People & Children";

export type Skill = "Business, Strategy & Legal"
    | "Communications, Marketing & Events"
    | "CPR/First Aid"
    | "Creative Services"
    | "Digital, Data & IT"
    | "Finance & Fundraising"
    | "Heavy Equipment Operator"
    | "Leadership & Management"
    | "Mechanic"
    | "Medical Doctor"
    | "Medical Nurse"
    | "Medical Paramedic"
    | "Organisational Policy & Governance"
    | "Property & Infrastructure"
    | "Radio Operator"
    | "Research, Service Design & User Insight"
    | "Search and Rescue"
    | "Support, Training & Advocacy"
    | "Sustainability & Energy";

export interface TimePreferences {
    hours?: HourPreference[];
    days?: DayPreference[];
    durationHours?: number;
    commitment?: TimeCommitment;
}

export type TimeCommitment = 'One Time' | 'Weekly' | 'Monthly' | 'Flexible';
export type HourPreference = 'morning' | 'afternoon' | 'evening';
export type DayPreference = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DateRange {
    startDate: string;
    endDate: string;
}

export interface QueryVolunteers {
    keywords?: string;
    postcode?: string;
    maxDistanceKm?: number;
    hourPreferences?: HourPreference[];
    dayPreferences?: DayPreference[];
    minDurationHours?: number;
    startDate?: string;
    endDate?: string;
    causes?: Cause[];
    skills?: Skill[];
    presence?: Presence;
    languages?: ISO639Language[];
    minAge?: number;
    maxAge?: number;
    minor?: boolean;
    gender?: Gender;
    timeCommitment?: TimeCommitment;
}