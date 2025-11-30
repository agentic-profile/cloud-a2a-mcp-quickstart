import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import McpToolCallCard from '@/components/McpToolCallCard';
import { useState } from 'react';
import { JsonEditor } from '@/components';
import type { JsonExample } from '@/components/JsonEditor';

const EXAMPLE_QUERIES: JsonExample[] = [
    {
        name: 'Keywords',
        payload: {
            keywords: 'Rachel'
        }
    },
    {
        name: 'Postcode',
        payload: {
            postcode: 'WC1N 1RT'
        }
    },
    {
        name: 'Max Distance',
        payload: {
            maxDistanceKm: 5
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
            dayPreferences: ['sunday']
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
            causes: ['Community', 'Animal welfare']
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
            presence: ['in-person']
        }
    },
    {
        name: 'Languages',
        payload: {
            languages: ['en']
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
            timeCommitment: 'weekly'
        }
    },
    {
        name: 'History Since',
        payload: {
            historySince: '2020-01-01T00:00:00.000Z'
        }
    },
    {
        name: 'History Activities',
        payload: {
            historyActivities: 10
        }
    },
    {
        name: 'History Organizations',
        payload: {
            historyOrganizations: ['Habitat for Humanity', 'Salvation Army']
        }
    },
    {
        name: 'All Fields',
        payload: {
            keywords: 'Rachel',
            postcode: 'WC1N 1RT',
            maxDistanceKm: 5,
            hourPreferences: ['morning'],
            dayPreferences: ['sunday'],
            minDurationHours: 4,
            startDate: '2024-06-01',
            endDate: '2026-06-30',
            causes: ['Community', 'Animal welfare'],
            skills: ['Medical Doctor', 'CPR/First Aid'],
            presence: ['in-person'],
            languages: ['en'],
            minAge: 18,
            maxAge: 65,
            minor: false,
            gender: 'female',
            timeCommitment: 'weekly',
            historySince: '2020-01-01T00:00:00.000Z',
            historyActivities: 10,
            historyOrganizations: ['Habitat for Humanity', 'Salvation Army']
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
