declare module '@digitalbazaar/vc' {
  interface Credential {
    [key: string]: any;
  }

  interface Presentation {
    [key: string]: any;
  }

  interface DocumentLoaderResult {
    contextUrl?: string;
    document: any;
    documentUrl: string;
  }

  type DocumentLoader = (url: string) => Promise<DocumentLoaderResult>;

  interface CreatePresentationOptions {
    suite?: any;
    credential?: Credential | Credential[];
    documentLoader?: DocumentLoader;
    [key: string]: any;
  }

  interface IssueCredentialOptions {
    credential: Credential;
    suite: any;
    documentLoader?: DocumentLoader;
    [key: string]: any;
  }

  interface VerifyCredentialOptions {
    credential: Credential;
    suite?: any;
    documentLoader?: DocumentLoader;
    [key: string]: any;
  }

  interface VerifyPresentationOptions {
    presentation: Presentation;
    suite?: any;
    documentLoader?: DocumentLoader;
    [key: string]: any;
  }

  export function createPresentation(options: CreatePresentationOptions): Promise<Presentation>;
  export function issue(options: IssueCredentialOptions): Promise<Credential>;
  export function verifyCredential(options: VerifyCredentialOptions): Promise<any>;
  export function verifyPresentation(options: VerifyPresentationOptions): Promise<any>;
}
