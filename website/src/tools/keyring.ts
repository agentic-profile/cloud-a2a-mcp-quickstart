import { type AgenticProfile, type JWKSet } from '@agentic-profile/common/schema';
import { type VerificationMethod } from 'did-resolver';

export function resolveAgentAndVerificationId( profile: AgenticProfile, keyring: JWKSet[] ) {
    // prefer agents over verificationMethods
    for( const service of profile.service ?? [] ) {
        const verificationId = firstAgentKey(service.capabilityInvocation, keyring);
        if( verificationId )
            return { agentDid: `${profile.id}${service.id}`, verificationId };
    }

    // fallback to the "naked" agent and a identity wide verificationMethod
    const verificationId = firstAgentKey(profile.verificationMethod, keyring);
    if( verificationId )
        return { agentDid: profile.id, verificationId };
    else
        return {};
}

export function hasPublicKey( b64uPublicKey: string, keyring: JWKSet[] ) {
    return keyring.some((keyset: JWKSet) => keyset.b64uPublicKey === b64uPublicKey);
}

export function firstAgentKey(methods: (string | VerificationMethod)[] = [], keyring: JWKSet[]) {
    for( const m of methods ) {
        if( typeof m !== 'string' ) {
            const vm = m as VerificationMethod;
            if( hasPublicKey(vm.publicKeyJwk?.x as string, keyring) ) {
                return vm.id;
            }
        }
    }

    return undefined;
}