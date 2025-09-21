// JSON-LD Document Loader for Verifiable Credentials

// Common JSON-LD contexts for verifiable credentials
const CONTEXTS = {
  'https://www.w3.org/2018/credentials/v1': {
    '@context': {
      '@version': 1.1,
      '@protected': true,
      'id': '@id',
      'type': '@type',
      'VerifiableCredential': {
        '@id': 'https://www.w3.org/2018/credentials#VerifiableCredential',
        '@context': {
          '@version': 1.1,
          '@protected': true,
          'id': '@id',
          'type': '@type',
          'credentialSubject': {
            '@id': 'https://www.w3.org/2018/credentials#credentialSubject',
            '@type': '@id'
          },
          'issuer': {
            '@id': 'https://www.w3.org/2018/credentials#issuer',
            '@type': '@id'
          },
          'issuanceDate': {
            '@id': 'https://www.w3.org/2018/credentials#issuanceDate',
            '@type': 'http://www.w3.org/2001/XMLSchema#dateTime'
          },
          'proof': {
            '@id': 'https://w3id.org/security#proof',
            '@type': '@id',
            '@container': '@graph'
          }
        }
      }
    }
  },
  'https://www.w3.org/ns/credentials/v2': {
    '@context': {
      '@version': 1.1,
      '@protected': true,
      'id': '@id',
      'type': '@type',
      'description': 'https://schema.org/description',
      'name': 'https://schema.org/name',
      'VerifiableCredential': {
        '@id': 'https://www.w3.org/2018/credentials#VerifiableCredential',
        '@context': {
          '@version': 1.1,
          '@protected': true,
          'id': '@id',
          'type': '@type',
          'credentialSchema': {
            '@id': 'https://www.w3.org/2018/credentials#credentialSchema',
            '@type': '@id'
          },
          'credentialStatus': {
            '@id': 'https://www.w3.org/2018/credentials#credentialStatus',
            '@type': '@id'
          },
          'credentialSubject': {
            '@id': 'https://www.w3.org/2018/credentials#credentialSubject',
            '@type': '@id'
          },
          'evidence': {
            '@id': 'https://www.w3.org/2018/credentials#evidence',
            '@type': '@id'
          },
          'expirationDate': {
            '@id': 'https://www.w3.org/2018/credentials#expirationDate',
            '@type': 'http://www.w3.org/2001/XMLSchema#dateTime'
          },
          'holder': {
            '@id': 'https://www.w3.org/2018/credentials#holder',
            '@type': '@id'
          },
          'issued': {
            '@id': 'https://www.w3.org/2018/credentials#issued',
            '@type': 'http://www.w3.org/2001/XMLSchema#dateTime'
          },
          'issuer': {
            '@id': 'https://www.w3.org/2018/credentials#issuer',
            '@type': '@id'
          },
          'issuanceDate': {
            '@id': 'https://www.w3.org/2018/credentials#issuanceDate',
            '@type': 'http://www.w3.org/2001/XMLSchema#dateTime'
          },
          'proof': {
            '@id': 'https://w3id.org/security#proof',
            '@type': '@id',
            '@container': '@graph'
          },
          'refreshService': {
            '@id': 'https://www.w3.org/2018/credentials#refreshService',
            '@type': '@id'
          },
          'termsOfUse': {
            '@id': 'https://www.w3.org/2018/credentials#termsOfUse',
            '@type': '@id'
          },
          'validFrom': {
            '@id': 'https://www.w3.org/2018/credentials#validFrom',
            '@type': 'http://www.w3.org/2001/XMLSchema#dateTime'
          },
          'validUntil': {
            '@id': 'https://www.w3.org/2018/credentials#validUntil',
            '@type': 'http://www.w3.org/2001/XMLSchema#dateTime'
          }
        }
      },
      'VerifiablePresentation': {
        '@id': 'https://www.w3.org/2018/credentials#VerifiablePresentation',
        '@context': {
          '@version': 1.1,
          '@protected': true,
          'id': '@id',
          'type': '@type',
          'holder': {
            '@id': 'https://www.w3.org/2018/credentials#holder',
            '@type': '@id'
          },
          'proof': {
            '@id': 'https://w3id.org/security#proof',
            '@type': '@id',
            '@container': '@graph'
          },
          'verifiableCredential': {
            '@id': 'https://www.w3.org/2018/credentials#verifiableCredential',
            '@type': '@id',
            '@container': '@graph'
          }
        }
      }
    }
  },
  'https://w3id.org/security/suites/ed25519-2020/v1': {
    '@context': {
      '@version': 1.1,
      '@protected': true,
      'Ed25519VerificationKey2020': {
        '@id': 'https://w3id.org/security#Ed25519VerificationKey2020',
        '@context': {
          '@protected': true,
          'id': '@id',
          'type': '@type',
          'publicKeyMultibase': 'https://w3id.org/security#publicKeyMultibase'
        }
      },
      'Ed25519Signature2020': {
        '@id': 'https://w3id.org/security#Ed25519Signature2020',
        '@context': {
          '@protected': true,
          'id': '@id',
          'type': '@type',
          'proofValue': 'https://w3id.org/security#proofValue',
          'verificationMethod': {
            '@id': 'https://w3id.org/security#verificationMethod',
            '@type': '@id'
          }
        }
      }
    }
  }
};

export interface DocumentLoaderResult {
  contextUrl?: string;
  document: any;
  documentUrl: string;
}

export type DocumentLoader = (url: string) => Promise<DocumentLoaderResult>;

/**
 * Document loader function for resolving JSON-LD contexts
 * Used by DigitalBazaar VC library for context resolution
 */
export async function documentLoader(url: string): Promise<DocumentLoaderResult> {
  // First, check our local cache
  if (CONTEXTS[url as keyof typeof CONTEXTS]) {
    return {
      contextUrl: undefined,
      document: CONTEXTS[url as keyof typeof CONTEXTS],
      documentUrl: url
    };
  }
  
  // Special handling for v2 contexts - if the library doesn't support them,
  // we can fallback to v1 contexts in some cases
  if (url === 'https://www.w3.org/ns/credentials/v2') {
    console.log('Using v2 context with v1.1 JSON-LD version for compatibility');
    return {
      contextUrl: undefined,
      document: CONTEXTS[url as keyof typeof CONTEXTS],
      documentUrl: url
    };
  }
  
  // For remote contexts, try to fetch them
  // This is enabled for production use
  try {
    console.log(`Fetching remote context: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
    }
    const document = await response.json();
    
    // If the fetched document has @version: 2, convert it to 1.1 for compatibility
    const typedDocument = document as any;
    if (typedDocument['@context'] && typedDocument['@context']['@version'] === 2) {
      console.log('Converting JSON-LD version 2 to 1.1 for compatibility');
      typedDocument['@context']['@version'] = 1.1;
      if (!typedDocument['@context']['@protected']) {
        typedDocument['@context']['@protected'] = true;
      }
    }
    
    // Cache the fetched context for future use
    (CONTEXTS as any)[url] = document;
    
    return {
      contextUrl: undefined,
      document: document,
      documentUrl: url
    };
  } catch (error) {
    console.error(`Error fetching document from ${url}:`, error);
    throw new Error(`Document loader could not resolve URL: ${url}. Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Add a new context to the local cache
 */
export function addContext(url: string, context: any): void {
  (CONTEXTS as any)[url] = context;
}

/**
 * Get all cached contexts
 */
export function getCachedContexts(): Record<string, any> {
  return { ...CONTEXTS };
}
