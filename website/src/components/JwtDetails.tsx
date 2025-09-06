import React, { useState } from 'react';
import { Button } from './Button';
import { LabelJson } from './LabelJson';

interface JwtDetailsProps {
    jwt: string | null;
    onClear: () => void;
    className?: string;
}

export const JwtDetails: React.FC<JwtDetailsProps> = ({ 
    jwt, 
    onClear, 
    className = '' 
}) => {
    const [showDetails, setShowDetails] = useState(false);

    const decodeJwt = (token: string) => {
        try {
            // Split the JWT into its three parts
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }

            // Decode header and payload (base64url decode)
            const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

            return {
                header,
                payload,
                signature: parts[2] // Keep signature as-is since it's not human-readable
            };
        } catch (error) {
            return {
                error: `Failed to decode JWT: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    };

    const handleDetailsClick = () => {
        setShowDetails(!showDetails);
    };

    if( !jwt ) return null;

    const jwtData = decodeJwt(jwt);

    return (
        <div className={className}>
            <div className="flex items-start gap-2 mb-2">
                <strong>JWT:</strong>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded border break-all">
                        {jwt}
                    </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <Button 
                        //variant="danger" 
                        size="sm" 
                        onClick={onClear}
                    >
                        Clear
                    </Button>
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={handleDetailsClick}
                    >
                        {showDetails ? 'Hide Details' : 'Details'}
                    </Button>
                </div>
            </div>
            
            {showDetails && (
                <div className="mt-4">
                    {jwtData.error ? (
                        <LabelJson 
                            label="JWT Decode Error" 
                            data={jwtData.error}
                            variant="failure"
                        />
                    ) : (
                        <div className="space-y-4">
                            <LabelJson 
                                label="JWT Header" 
                                data={jwtData.header}
                            />
                            <LabelJson 
                                label="JWT Payload" 
                                data={jwtData.payload}
                            />
                            <LabelJson 
                                label="JWT Signature" 
                                data={jwtData.signature}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
