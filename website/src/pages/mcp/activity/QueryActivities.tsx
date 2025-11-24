import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import McpToolCallCard from '@/components/McpToolCallCard';
import { useState } from 'react';
import { JsonEditor } from '@/components';
import type { JsonExample } from '@/components/JsonEditor';

const EXAMPLE_QUERIES: JsonExample[] = [
    {
        name: 'Postcode',
        payload: {
            postcode: 'DT1 2NH'
        }
    },
    {
        name: 'Text Search',
        payload: {
            text: 'london'
        }
    },
    {
        name: 'Distance',
        payload: {
            geolocation: {
                latitude: 51.5074,
                longitude: -0.1278
            },
            distance: 10
        }
    },
    {
        name: 'Remote or In Person',
        payload: {
            attendanceType: 'Home' // 'Local'
        }
    }, /*
    {
        name: 'Time commitment',
        payload: {
            timeCommitment: 'any', // one-time, weekly, monthly, flexible 
        }
    }*/
    {
        name: 'All',
        payload: {
            "text": "london",
            "postcode": "E1 3DG",
            "geolocation": {
              "latitude": 51.5171364,
              "longitude": -0.0428627
            },
            "distance": 10,
            "attendanceType": "Local"
          }
    }
];

interface QueryActivitiesProps {
    onSubmitHttpRequest: (request: any) => void;
}

const QueryActivities = ({ onSubmitHttpRequest }: QueryActivitiesProps) => {
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
            title="Query Activities"
            icon={<MagnifyingGlassIcon className="w-5 h-5 text-white" />}
            description="Click the button below to query the current activities."
            buttonText="Query Activities"
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

export default QueryActivities;

function jsonToObject(json: string): any | undefined {
    try {
        return JSON.parse(json);
    } catch {
        return undefined;
    }
}
