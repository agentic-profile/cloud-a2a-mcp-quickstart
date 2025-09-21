declare module '@digitalbazaar/ed25519-verification-key-2020' {
  interface KeyPairOptions {
    id?: string;
    controller?: string;
    seed?: Uint8Array;
    [key: string]: any;
  }

  interface KeyPair {
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase: string;
    privateKeyMultibase?: string;
    export(options?: { publicKey?: boolean; privateKey?: boolean }): Promise<any>;
    fingerprint(): string;
    verifyFingerprint(fingerprint: string): boolean;
    [key: string]: any;
  }

  export class Ed25519VerificationKey2020 {
    constructor(options?: KeyPairOptions);
    
    static generate(options?: KeyPairOptions): Promise<Ed25519VerificationKey2020>;
    static from(options: any): Promise<Ed25519VerificationKey2020>;
    static fromFingerprint(options: { fingerprint: string }): Ed25519VerificationKey2020;
    
    id: string;
    type: string;
    controller: string;
    publicKeyMultibase: string;
    privateKeyMultibase?: string;
    
    export(options?: { publicKey?: boolean; privateKey?: boolean }): Promise<any>;
    fingerprint(): string;
    verifyFingerprint(fingerprint: string): boolean;
    [key: string]: any;
  }
}
