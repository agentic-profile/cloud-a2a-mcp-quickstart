import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import McpToolCallCard from '@/components/McpToolCallCard';
import { useState } from 'react';
import { JsonEditor } from '@/components';
import type { JsonExample } from '@/components/JsonEditor';

const EXAMPLE_QUERIES: JsonExample[] = [
    {
        name: 'Keywords',
        payload: {
            keywords: 'london'
        }
    },
    {
        name: 'Postcode',
        payload: {
            postcode: 'DT1 2NH'
        }
    },
    {
        name: 'Max Distance',
        payload: {
            maxDistanceKm: 10
        }
    },
    {
        name: 'Hour Preference',
        payload: {
            hourPreferences: ['morning']
        }
    },
    {
        name: 'Day Preference',
        payload: {
            dayPreferences: ['saturday']
        }
    },
    {
        name: 'Min Duration',
        payload: {
            minDurationHours: 4
        }
    },
    {
        name: 'Date Range',
        payload: {
            startDate: '2024-06-01',
            endDate: '2026-06-30'
        }
    },
    {
        name: 'Causes',
        payload: {
            causes: ['Community', 'Health and social care']
        }
    },
    {
        name: 'Skills',
        payload: {
            skills: ['Medical Doctor', 'CPR/First Aid']
        }
    },
    {
        name: 'Presence',
        payload: {
            presence: 'remote'
        }
    },
    {
        name: 'Languages',
        payload: {
            languages: ['en', 'fr', 'es']
        }
    },
    {
        name: 'Age Range',
        payload: {
            minAge: 18,
            maxAge: 65
        }
    },
    {
        name: 'Minor',
        payload: {
            minor: false
        }
    },
    {
        name: 'Gender',
        payload: {
            gender: 'female'
        }
    },
    {
        name: 'Time Commitment',
        payload: {
            timeCommitment: 'Weekly'
        }
    },
    {
        name: 'All Fields',
        payload: {
            keywords: 'london',
            postcode: 'E1 3DG',
            maxDistanceKm: 10,
            hourPreferences: ['afternoon'],
            dayPreferences: ['saturday'],
            minDurationHours: 4,
            startDate: '2024-06-01',
            endDate: '2024-06-30',
            causes: ['Community', 'Health and social care', 'Young People & Children'],
            skills: ['Medical Doctor', 'CPR/First Aid', 'Support, Training & Advocacy'],
            presence: 'both',
            languages: ['en', 'fr'],
            minAge: 25,
            maxAge: 55,
            minor: false,
            gender: 'female',
            timeCommitment: 'Weekly'
        }
    }
];

interface QueryVolunteersProps {
    onSubmitHttpRequest: (request: any) => void;
}

const QueryVolunteers = ({ onSubmitHttpRequest }: QueryVolunteersProps) => {
    const [ queryJson, setQueryJson ] = useState<string>('');
    
    const createMcpRequest = () => {
        const query = jsonToObject(queryJson);
        if( !query )
            return undefined;

        return {
            method: 'tools/call',
            params: {
                name: 'query',
                arguments: query
            }
        };
    };

    return (
        <McpToolCallCard
            title="Query Volunteers"
            icon={<MagnifyingGlassIcon className="w-5 h-5 text-white" />}
            description="Click the button below to query the current volunteers."
            buttonText="Query Volunteers"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        >
            <JsonEditor 
                value={queryJson}
                onChange={setQueryJson}
                placeholder="Enter your JSON query here..."
                height="h-48"
                examples={EXAMPLE_QUERIES}
            />
        </McpToolCallCard>
    );
};

export default QueryVolunteers;

function jsonToObject(json: string): any | undefined {
    try {
        return JSON.parse(json);
    } catch {
        return undefined;
    }
}
