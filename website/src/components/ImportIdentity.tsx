import { useEffect, useState } from 'react';
import {
    createEdDsaJwk
} from "@agentic-profile/auth";
import { webDidToUrl } from "@agentic-profile/common";

import { EditableUrl } from './EditableUrl';
import { Button } from './Button';
import { useImportIdentityStore, useUserProfileStore } from '../stores';
import { LabelValue } from './LabelValue';
import { Card, CardBody } from './Card';

const DEFAULT_IDENTITY_HOST_URLS = [
    'https://matchwise.ai/import',
    'http://localhost:5174/import',
    'https://lifepass.example.com/import'
];

// Base64web encoding function (URL-safe base64)
const base64webEncode = (str: string): string => {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
};

export const wantsFocus = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const kid = urlParams.get('kid');
    const did = urlParams.get('did');
    
    // If both parameters are present, focus on this component
    return kid && did ? true : false;
}

export default function ImportIdentity() {
    const { setUserProfile } = useUserProfileStore();
    const { exportKeyring, identityHostUrl, setExportKeyring, setIdentityHostUrl } = useImportIdentityStore();
    const [did,setDid] = useState<string|undefined>(undefined);

    useEffect(() => {
        if (!exportKeyring) 
            regenerateKeyring();
        
        // Extract query string parameters
        const urlParams = new URLSearchParams(window.location.search);
        const did = urlParams.get('did');
        const kid = urlParams.get('kid');
        
        // Check if both did and kid are provided and kid matches exportKeyring.b64uPublicKey
        if (did && kid && exportKeyring && kid === exportKeyring.b64uPublicKey)
            setDid(did);

    }, [exportKeyring]);

    const regenerateKeyring = async () => {
        const newKeyring = await createEdDsaJwk();
        setExportKeyring(newKeyring);
    };

    const startOver = async () => {
        // Clear query string parameters from the window
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, document.title, url.toString());
        
        // Regenerate the keyring
        await regenerateKeyring();
        
        // Clear the DID
        setDid(undefined);
    };

    const sharePublicKey = () => {
        try {
            if (!exportKeyring?.publicJwk) {
                console.error('No keyring available for import');
                return;
            }
            
            // Convert the publicKey to a string and encode it
            const json = JSON.stringify({
                kind: "verificationMethod",
                id: "#user-key",
                jwk: exportKeyring.publicJwk
            });

            const callback = new URL(window.location.href);
            callback.searchParams.set('kid', exportKeyring.b64uPublicKey);
            
            // Construct the URL with the encoded public key
            const url = new URL(identityHostUrl);
            url.searchParams.set('key', base64webEncode(json));
            url.searchParams.set('callback', encodeURIComponent(callback.toString()));
            
            // Open the URL in a new window
            window.open(url.toString(), '_import');
        } catch (error) {
            console.error('Error importing identity:', error);
        }
    };

    const saveIdentity = async () => {
        if(!exportKeyring || !did) {
            console.error('No keyring available for import');
            return;
        }

        try {
            const url = webDidToUrl(did);
            const response = await fetch(url);
            if( response.ok ) {
                const data = await response.json();
                console.log('profile',data);
                setUserProfile({profile: data, keyring: [exportKeyring]});
            }
        }
        catch (error) {
            console.error('Error saving identity:', error);
        }
    }

    return (
        <div>
            <p className="mb-6">
                Import your identity from Matchwise and use to authenticate with
                A2A and MCP services.
            </p>
            
            <EditableUrl
                card={false}
                label="Identity Host URL"
                value={identityHostUrl}
                placeholder="Enter identity host URL..."
                onUpdate={setIdentityHostUrl}
                options={DEFAULT_IDENTITY_HOST_URLS}
            />
            <LabelValue label="DID" value={did} />

            {did && (
                <Card variant="success" className="mt-4">
                    <CardBody>
                        Your keys have been added to Matchwise. Click Complete Import to save.
                    </CardBody>
                </Card>
            )}

            <div className="mt-4 flex justify-end gap-3">
                <Button
                    onClick={startOver}
                    variant="secondary"
                    size="md"
                >
                    Start Over
                </Button>
                <Button
                    onClick={sharePublicKey}
                    disabled={!exportKeyring?.publicJwk || !!did}
                    variant="primary"
                    size="md"
                >
                    Upload Public Key
                </Button>
                <Button
                    onClick={saveIdentity}
                    disabled={!exportKeyring?.publicJwk || !did}
                    variant="success"
                    size="md"
                >
                    Complete Import
                </Button>
            </div>
            
            {exportKeyring && (
                <div className="mt-6">
                    <div className="mb-3">
                        <h3 className="text-lg font-medium">Generated Local JWT Keyring</h3>
                    </div>
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
                        {JSON.stringify(exportKeyring, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
