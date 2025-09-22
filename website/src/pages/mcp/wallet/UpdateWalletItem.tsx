import { useState } from 'react';
import { Card, CardBody, Button, LabelValue, HttpProgressSummary } from '@/components';
import { PlusIcon } from '@heroicons/react/24/outline';
import { type HttpProgress, type HttpRequest } from '@/components/JsonRpcDebug';

interface UpdateWalletItemProps {
    walletItemKey: string;
    onSubmitHttpRequest: (request: HttpRequest) => void;
}

const UpdateWalletItem = ({ walletItemKey, onSubmitHttpRequest }: UpdateWalletItemProps) => {
    const [credentialData, setCredentialData] = useState<string>('{\n  "type": "VerifiableCredential",\n  "credentialSubject": {\n    "id": "did:example:123",\n    "name": "Example Credential"\n  }\n}');
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [httpProgress, setHttpProgress] = useState<HttpProgress | undefined>(undefined);

    const handleExampleClick = (exampleData: any) => {
        setCredentialData(JSON.stringify(exampleData, null, 2));
    };

    const handleWalletUpdate = () => {
        let parsedCredential;
        try {
            parsedCredential = JSON.parse(credentialData);
        } catch (error) {
            alert('Invalid JSON in credential data');
            return;
        }

        const mcpRequest = {
            method: "tools/call",
            params: {
                name: "update",
                item: {
                    key: walletItemKey,
                    credential: parsedCredential,
                    public: isPublic
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
        <Card className="lg:col-span-2">
            <CardBody>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                        <PlusIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3>Create/Update Wallet Item</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md border">
                        <LabelValue label="Using wallet key" value={walletItemKey} />
                        <p className="sm">This key is managed by the Wallet Item Key card above</p>
                    </div>
                    
                    <div>
                        <div className="mb-3">
                            <p className="sm">Examples:</p>
                            <div className="flex flex-wrap gap-2">
                                {EXAMPLES.map((example, index) => (
                                    <Button
                                        key={index}
                                        onClick={() => handleExampleClick(example.data)}
                                        variant="secondary"
                                        size="sm"
                                        className="text-xs"
                                    >
                                        {example.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <label htmlFor="credentialData" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Credential Data (JSON)
                        </label>
                        <textarea
                            id="credentialData"
                            value={credentialData}
                            onChange={(e) => setCredentialData(e.target.value)}
                            rows={10}
                            placeholder='{"type": "VerifiableCredential", "credentialSubject": {...}}'
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">JSON object containing the credential data</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isPublic"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-xs text-gray-500">Make this wallet item publicly accessible</span>
                    </div>
                    
                    <Button
                        onClick={handleWalletUpdate}
                        className="w-full"
                        color="primary"
                    >
                        Create/Update Wallet Item
                    </Button>

                    <HttpProgressSummary progress={httpProgress} />
                </div>
            </CardBody>
        </Card>
    );
};

export default UpdateWalletItem;
const EXAMPLES = [
    { 
        name: "Auth0 Verified Credential",
        data: {
            "@context": [
                "https://www.w3.org/2018/credentials/v1"
            ],
            "type": ["VerifiableCredential", "IDCard"],
            "id": "urn:credential:34502108-4540",
            "issuer": "did:web:asgard-state.auth0lab.com",
            "issuanceDate": "2020-07-20T13:58:53Z",
            "credentialSubject": {
                "id": "urn:id-card:personal:1",
                "personalIdentifier": "34502108",
                "name": "Hanna Herwitz",
                "dateOfBirth": "1984-09-17",
                "placeOfBirth": "Asgard City",
                "currentAddress": "24th Street 210, Asgard City, 1023",
                "gender": "Female"
            },
            "credentialStatus": {
                "id": "https://asgard-state.auth0lab.com/vcs/credential/status/14",
                "type": "CredentialStatusList2017"
            },
            "proof": {
                "type": "Ed25519Signature2020",
                "created": "2020-07-20T13:58:53Z",
                "proofPurpose": "assertionMethod",
                "verificationMethod": "https://asgard-state.auth0lab.com/keys/1",
                "proofValue": "z2ty8BNvrKCvAXGqJVXF8aZ1jK5o5uXFvhXJksUXhn61uSwJJmWdcntfqvZTLbWmQHpieyhdcrG43em37Jo8bswvR"
            }
        }
    },
    {
        name: "Simple Credential",
        data:{
            "@context": [
                "https://www.w3.org/ns/credentials/v2",
                "https://www.w3.org/ns/credentials/examples/v2"
            ],
            "id": "https://university.example/Credential123",
            "type": ["VerifiableCredential", "ExampleAlumniCredential"],
            "issuer": "did:example:2g55q912ec3476eba2l9812ecbfe",
            "validFrom": "2010-01-01T00:00:00Z",
            "credentialSubject": {
                "id": "https://www.example.org/persons/pat",
                "name": "Pat",
                "alumniOf": {
                    "id": "did:example:c276e12ec21ebfeb1f712ebc6f1",
                    "name": "Example University"
                }
            }
        }
    },
    {
        name: "CA Drivers License",
        data: {
            "@context": [
                "https://www.w3.org/ns/credentials/v2",
                "https://www.w3.org/ns/credentials/examples/v2"
            ],
            "id": "https://university.example/Credential123",
            "type": ["VerifiableCredential", "ExampleAlumniCredential"],
            "issuer": "did:example:2g55q912ec3476eba2l9812ecbfe",
            "validFrom": "2010-01-01T00:00:00Z",
            "credentialSubject": {
                "id": "https://www.example.org/persons/john-doe",
                "family_name":"Doe",
                "given_name":"John",
                "birth_date":"1980-10-10",
                "issue_date":"2020-08-10",
                "expiry_date":"2030-10-30",
                "issuing_country":"US",
                "issuing_authority":"CA DMV",
                "document_number":"I12345678",
                "portrait":"../../../../test/issuance/portrait.b64",
                "driving_privileges":[
                    {
                        "vehicle_category_code":"A",
                        "issue_date":"2022-08-09",
                        "expiry_date":"2030-10-20"
                    },
                    {
                        "vehicle_category_code":"B",
                        "issue_date":"2022-08-09",
                        "expiry_date":"2030-10-20"
                    }
                ],
                "un_distinguishing_sign":"USA",
                "weight":70,
                "eye_colour":"hazel",
                "hair_colour":"red",
                "birth_place":"California",
                "resident_address":"2415 1st Avenue",
                "portrait_capture_date":"2020-08-10T12:00:00Z",
                "age_in_years":42,
                "age_birth_year":1980,
                "age_over_18":true,
                "age_over_21":true,
                "issuing_jurisdiction":"US-CA",
                "nationality":"US",
                "resident_city":"Sacramento",
                "resident_state":"California",
                "resident_postal_code":"95818",
                "resident_country": "US"
            }
        }
    }
];

