import { useState } from 'react';
import { Card, CardBody, Button, HttpProgressSummary } from '@/components';
import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { type HttpProgress, type HttpRequest } from '@/components/JsonRpcDebug';

interface LocationData {
    latitude: number;
    longitude: number;
}

interface UpdateLocationProps {
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const UpdateLocation: React.FC<UpdateLocationProps> = ({ onSubmitHttpRequest }) => {
    const [locationData, setLocationData] = useState<LocationData>({
        latitude: 40.7128,
        longitude: -74.0060
    });
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);

    const handleLocationUpdate = () => {
        const mcpRequest = {
            //jsonrpc: "2.0",
            //id: 1,
            method: "tools/call",
            params: {
                name: "update",
                coords: {
                    latitude: locationData.latitude,
                    longitude: locationData.longitude
                }
            }
        };

        const request: RequestInit = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mcpRequest),
        };

        onSubmitHttpRequest({
            requestInit: request,
            onProgress: setHttpProgress
        });
    };

    return (
        <div>
            <Card>
                <CardBody>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                            <ArrowUpIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">Update Location</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="update-latitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Latitude
                            </label>
                            <input
                                id="update-latitude"
                                type="number"
                                value={locationData.latitude}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                                step="any"
                                placeholder="40.7128"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="update-longitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Longitude
                            </label>
                            <input
                                id="update-longitude"
                                type="number"
                                value={locationData.longitude}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocationData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                                step="any"
                                placeholder="-74.0060"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        
                        <Button
                            onClick={handleLocationUpdate}
                            className="w-full"
                            color="primary"
                        >
                            Update Location
                        </Button>
                        <HttpProgressSummary progress={httpProgress} />
                    </div>
                </CardBody>
            </Card>


        </div>
    );
};

export default UpdateLocation;
