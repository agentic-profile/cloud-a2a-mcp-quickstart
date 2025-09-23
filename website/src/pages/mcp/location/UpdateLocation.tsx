import { useState } from 'react';
import McpToolCallCard from '@/components/McpToolCallCard';
import { EditableValue } from '@/components/EditableValue';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { type HttpRequest } from '@/components/JsonRpcDebug';

interface LocationData {
    latitude: string;
    longitude: string;
}

interface UpdateLocationProps {
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

// Validation function for numeric coordinates
const validateCoordinate = (value: string | null | undefined): boolean => {
    if (!value || value.trim() === '') return false;
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num);
};

const UpdateLocation: React.FC<UpdateLocationProps> = ({ onSubmitHttpRequest }) => {
    const [locationData, setLocationData] = useState<LocationData>({
        latitude: "40.7128",
        longitude: "-74.0060"
    });

    const createMcpRequest = () => ({
        method: "tools/call",
        params: {
            name: "update",
            coords: {
                latitude: parseFloat(locationData.latitude),
                longitude: parseFloat(locationData.longitude)
            }
        }
    });

    return (
        <McpToolCallCard
            title="Update Location"
            icon={<ArrowUpIcon className="w-5 h-5 text-white" />}
            description="Enter latitude and longitude coordinates to update the location."
            buttonText="Update Location"
            createMcpRequest={createMcpRequest}
            onSubmitHttpRequest={onSubmitHttpRequest}
        >
            <EditableValue
                card={false}
                label="Latitude"
                value={locationData.latitude}
                placeholder="40.7128"
                inputType="number"
                validate={validateCoordinate}
                validationMessage="Please enter a valid latitude coordinate"
                onUpdate={(newValue) => setLocationData(prev => ({ ...prev, latitude: newValue }))}
            />
            
            <EditableValue
                card={false}
                label="Longitude"
                value={locationData.longitude}
                placeholder="-74.0060"
                inputType="number"
                validate={validateCoordinate}
                validationMessage="Please enter a valid longitude coordinate"
                onUpdate={(newValue) => setLocationData(prev => ({ ...prev, longitude: newValue }))}
            />
        </McpToolCallCard>
    );
};

export default UpdateLocation;
