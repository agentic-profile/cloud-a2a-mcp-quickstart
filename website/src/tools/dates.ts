/**
 * Converts an ISO8601 string to a human-friendly short date and time format
 * @param isoString - ISO8601 date string (e.g., "2024-01-15T14:30:00Z")
 * @returns Human-friendly date and time string (e.g., "Jan 15, 2:30 PM")
 */
export function formatShortDateTime(isoString: string): string {
    const date = new Date(isoString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    
    return date.toLocaleDateString('en-US', options);
}

/**
 * Converts an ISO8601 string to a human-friendly short date format (date only)
 * @param isoString - ISO8601 date string (e.g., "2024-01-15T14:30:00Z")
 * @returns Human-friendly date string (e.g., "Jan 15, 2024")
 */
export function formatShortDate(isoString: string): string {
    const date = new Date(isoString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    
    const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', options);
}

/**
 * Converts an ISO8601 string to a human-friendly short time format (time only)
 * @param isoString - ISO8601 date string (e.g., "2024-01-15T14:30:00Z")
 * @returns Human-friendly time string (e.g., "2:30 PM")
 */
export function formatShortTime(isoString: string): string {
    const date = new Date(isoString);
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };
    
    return date.toLocaleTimeString('en-US', options);
}
