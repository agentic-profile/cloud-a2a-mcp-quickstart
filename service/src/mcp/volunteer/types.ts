export interface Volunteer {
    did: string,         // did of the volunteer
    createdAt: string;
    updatedAt: string;

    name: string,
    description?: string,
    skills?: Skill[],
    preferences?: Preferences
    postcode?: string,
}

export interface Preferences {
    times?: TimePreferences;
    dates?: DateRange[];
    maxDistanceKm?: number
}

export type Skill = 'gardening' | 'animal_care' | 'event_organisation' | 'marketing' | 'fundraising' | 'administration';

export interface TimePreferences {
    hours?: ('morning' | 'afternoon' | 'evening')[];
    days?: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
    durationHours?: number;
}

export interface DateRange {
    startDate: string;
    endDate: string;
}