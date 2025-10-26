import { useEffect, useState } from 'react';
import {
    createEdDsaJwk
} from "@agentic-profile/auth";
import { webDidToUrl } from "@agentic-profile/common";

import { Button, EditableUri, LabelValue, Card, CardBody } from '@/components';
import { useImportIdentityStore, useUserProfileStore } from '@/stores';
import { resolveAgentAndVerificationId } from '@/tools/keyring';
import { resolveParamFromWindow } from '@/tools/net';
import { useNavigate } from 'react-router-dom';

const DEFAULT_IDENTITY_HOST_URLS = [
    'https://matchwise.ai/import/key',
    'https://lifepass.ai/import/key',
    'http://localhost:5174/import/key'
];

// Base64web encoding function (URL-safe base64)
const base64webEncode = (str: string): string => {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
};

export const wantsFocus = () => {
    const kid = resolveParamFromWindow('kid');
    const did = resolveParamFromWindow('did');
    
    // If both parameters are present, focus on this component
    return kid && did ? true : false;
}

export function ConnectIdentity() {
    const { setUserProfile, setUserAgentDid, setVerificationId } = useUserProfileStore();
    const { exportKeyring, identityHostUrl, setExportKeyring, setIdentityHostUrl, onSuccessAction, setOnSuccessAction } = useImportIdentityStore();
    const [did,setDid] = useState<string|undefined>(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        if (!exportKeyring) 
            regenerateKeyring();
        
        // Extract query string parameters
        const did = resolveParamFromWindow('did');
        const kid = resolveParamFromWindow('kid');
        
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
            
            // Convert the publicKey to a dated string and encode it
            const sinceEpoch = Math.floor(new Date().getTime() / 1000);
            const json = JSON.stringify({
                kind: "verificationMethod",
                id: `#user-key-${sinceEpoch}`,
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
                const keyring = [exportKeyring];
                setUserProfile({profile: data, keyring});

                const { agentDid, verificationId } = resolveAgentAndVerificationId( data, keyring );
                setUserAgentDid(agentDid ?? null);
                setVerificationId(verificationId ?? null);

                if( onSuccessAction ) {
                    navigate(onSuccessAction.page);
                    setOnSuccessAction(null);
                }
            }
        }
        catch (error) {
            console.error('Error saving identity:', error);
        }
    }

    const readyToComplete = !!(exportKeyring?.publicJwk && did);

    return (
        <div>
            <p className="mb-6">
                Connect to an Identity Host such as <a href="https://matchwise.ai" target="_blank">Matchwise</a> and register
                the keys generated below.  The keys will allow this browser to authenticate with A2A and MCP services on the Agentic Web.
            </p>
            
            <EditableUri
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
                    onClick={sharePublicKey}
                    disabled={!exportKeyring?.publicJwk || !!did}
                    variant={!!did ? 'secondary' : 'success'}
                    size="md"
                >
                    1. Upload Public Key
                </Button>
                <Button
                    onClick={saveIdentity}
                    disabled={!readyToComplete}
                    variant={readyToComplete ? 'success' : 'secondary'}
                    size="md"
                >
                    2. Complete Import
                </Button>
                <Button
                    onClick={startOver}
                    variant="secondary"
                    size="md"
                >
                    Start Over
                </Button>
            </div>

            <div className="mt-6">
                <div className="mb-3">
                    <h3 className="text-lg font-medium">Generated Local JWT Keyring</h3>
                </div>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(exportKeyring, null, 2)}
                </pre>
            </div>
        </div>
    );
}
