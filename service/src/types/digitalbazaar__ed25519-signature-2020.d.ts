declare module '@digitalbazaar/ed25519-signature-2020' {
  interface SuiteOptions {
    key?: any;
    verificationMethod?: string;
    signer?: any;
    date?: string | Date;
    [key: string]: any;
  }

  export class Ed25519Signature2020 {
    constructor(options?: SuiteOptions);
    
    type: string;
    key?: any;
    verificationMethod?: string;
    signer?: any;
    date?: string | Date;
    
    sign(options: { verifyData: Uint8Array; proof: any }): Promise<Uint8Array>;
    verify(options: { verifyData: Uint8Array; verificationMethod: any; signature: Uint8Array; proof: any }): Promise<boolean>;
    createProof(options: { document: any; purpose: any; documentLoader?: any }): Promise<any>;
    verifyProof(options: { proof: any; document: any; purpose: any; documentLoader?: any }): Promise<any>;
    
    [key: string]: any;
  }
}
