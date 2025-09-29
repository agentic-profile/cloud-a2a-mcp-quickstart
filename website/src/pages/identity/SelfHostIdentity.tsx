import { useEffect, useState } from "react";
import type { AgenticProfile, JWKSet } from "@agentic-profile/common/schema";
import { createEdDsaJwk } from "@agentic-profile/auth";
import { createAgenticProfile } from "@agentic-profile/common";
import { CardTitleAndBody } from "@/components/Card";


export default function SelfHostIdentity() {
    const [keyring, setKeyring] = useState<JWKSet[] | null>(null);
    const [profile, setProfile] = useState<AgenticProfile | null>(null);

    useEffect(() => {
        if (!keyring) 
            regenerateKeyring();
    }, []);

    const regenerateKeyring = async () => {
        const services = [
            {
                name: "Venture Agent",
                type: "A2A/venture",
                id: "venture",
                url: "https://example.com/a2a/venture"
            }
        ];
        const { profile, keyring } = await createAgenticProfile({ services, createJwkSet: createEdDsaJwk });
        profile.id = "did:web:example.com";
        setProfile( profile );
        setKeyring( keyring );
    };

    return (
        <div>
            <p className="mb-6">
                The easiest way to self-host your Agentic Web identity is by publishing your Agentic Profile (DID document) to a web server.
            </p>
            <p className="mb-6">
                Below is an example Agentic Profile that you can easily modify for your needs.  There is a single 
                verification method with a fragment identifier of #identity-key and whose public key is in the keyring below.
                Place the following Agentic Profile on your server at https://example.com/.well-known/did.json
            </p>

            <div className="mt-6">
                <div className="mb-3">
                    <h3 className="text-lg font-medium">Example Agentic Profile</h3>
                </div>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(profile, null, 4)}
                </pre>
            </div>

            <CardTitleAndBody
                title="Generated Local JWT Keyring - Keep this secret!"
                collapsible={true}
                className="mt-6"
            >
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
                    {JSON.stringify(keyring, null, 4)}
                </pre>
            </CardTitleAndBody>
        </div>
    );
}