import { ventureProfileStore } from '../stores/dynamodb-store.js';
import { VentureProfile } from '../stores/types.js';

// Mock the AWS SDK
jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/lib-dynamodb');

describe('DynamoDB VentureProfileStore', () => {
    const mockSend = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock the DynamoDB document client send method
        const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
        DynamoDBDocumentClient.from = jest.fn().mockReturnValue({
            send: mockSend
        });
    });

    describe('saveVentureProfile', () => {
        it('should save a venture profile successfully', async () => {
            const profile: VentureProfile = {
                uuid: '123e4567-e89b-12d3-a456-426614174000',
                did: 'did:example:venture123',
                name: 'Test Venture',
                description: 'A test venture company',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            };

            mockSend.mockResolvedValueOnce({});

            await ventureProfileStore.saveVentureProfile(profile);

            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    input: expect.objectContaining({
                        TableName: expect.any(String),
                        Item: expect.objectContaining({
                            id: 'venture-profile:did:example:venture123',
                            type: 'venture-profile',
                            uuid: profile.uuid,
                            did: profile.did,
                            name: profile.name,
                            description: profile.description,
                            createdAt: profile.createdAt,
                            updatedAt: profile.updatedAt
                        })
                    })
                })
            );
        });

        it('should handle DynamoDB errors when saving', async () => {
            const profile: VentureProfile = {
                uuid: '123e4567-e89b-12d3-a456-426614174000',
                did: 'did:example:venture123',
                name: 'Test Venture',
                description: 'A test venture company',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            };

            const error = new Error('DynamoDB error');
            mockSend.mockRejectedValueOnce(error);

            await expect(ventureProfileStore.saveVentureProfile(profile))
                .rejects.toThrow('Failed to save venture profile: DynamoDB error');
        });
    });

    describe('loadVentureProfile', () => {
        it('should load a venture profile successfully', async () => {
            const profile: VentureProfile = {
                uuid: '123e4567-e89b-12d3-a456-426614174000',
                did: 'did:example:venture123',
                name: 'Test Venture',
                description: 'A test venture company',
                createdAt: '2023-01-01T00:00:00.000Z',
                updatedAt: '2023-01-01T00:00:00.000Z'
            };

            mockSend.mockResolvedValueOnce({
                Item: {
                    uuid: profile.uuid,
                    did: profile.did,
                    name: profile.name,
                    description: profile.description,
                    createdAt: profile.createdAt,
                    updatedAt: profile.updatedAt
                }
            });

            const result = await ventureProfileStore.loadVentureProfile(profile.did);

            expect(result).toEqual(profile);
            expect(mockSend).toHaveBeenCalledWith(
                expect.objectContaining({
                    input: expect.objectContaining({
                        TableName: expect.any(String),
                        Key: {
                            id: 'venture-profile:did:example:venture123'
                        }
                    })
                })
            );
        });

        it('should return undefined when profile not found', async () => {
            mockSend.mockResolvedValueOnce({});

            const result = await ventureProfileStore.loadVentureProfile('did:example:nonexistent');

            expect(result).toBeUndefined();
        });

        it('should handle DynamoDB errors when loading', async () => {
            const error = new Error('DynamoDB error');
            mockSend.mockRejectedValueOnce(error);

            await expect(ventureProfileStore.loadVentureProfile('did:example:venture123'))
                .rejects.toThrow('Failed to load venture profile: DynamoDB error');
        });
    });
});
