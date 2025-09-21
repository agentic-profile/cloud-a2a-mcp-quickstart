import * as vc from '@digitalbazaar/vc';

// Required to set up a suite instance with private key
import {Ed25519VerificationKey2020} from '@digitalbazaar/ed25519-verification-key-2020';
import {Ed25519Signature2020} from '@digitalbazaar/ed25519-signature-2020';

// Import document loader
import {documentLoader} from './document-loader.js';

let suite: Ed25519Signature2020 | null = null;
let keyPair: Ed25519VerificationKey2020 | null = null;

interface SuiteOptions {
    issuerDid?: string;
    keyId?: string;
}

async function getSuite(options: SuiteOptions = {}): Promise<Ed25519Signature2020> {
    const {
        issuerDid = 'https://example.com/issuer',
        keyId = 'key-1'
    } = options;

    if (!suite || !keyPair) {
        // Generate a key pair with proper ID and controller
        const verificationMethodId = `${issuerDid}#${keyId}`;
        
        keyPair = await Ed25519VerificationKey2020.generate({
            id: verificationMethodId,
            controller: issuerDid
        });
        
        // Create the suite with the key and verification method
        suite = new Ed25519Signature2020({
            key: keyPair,
            verificationMethod: verificationMethodId
        });
    }
    return suite;
}

export async function issueCredential(credential: any, suiteOptions?: SuiteOptions) {
    const signatureSuite = await getSuite(suiteOptions);
    
    const signedVC = await vc.issue({
        credential: credential,
        suite: signatureSuite,
        documentLoader: documentLoader
    });

    return signedVC;
}

export async function createPresentation(credential: any, suiteOptions?: SuiteOptions) {
    const signatureSuite = await getSuite(suiteOptions);
    
    const presentation = await vc.createPresentation({
        suite: signatureSuite,
        credential: credential,
        documentLoader: documentLoader
    });
    
    return presentation;
}

// Keep the old function name for backward compatibility
export async function presentCredential(credential: any, suiteOptions?: SuiteOptions) {
    return issueCredential(credential, suiteOptions);
}

export async function getPublicKey(suiteOptions?: SuiteOptions) {
    await getSuite(suiteOptions); // Ensure key pair is initialized
    if (keyPair) {
        return await keyPair.export({ publicKey: true });
    }
    throw new Error('Key pair not initialized');
}