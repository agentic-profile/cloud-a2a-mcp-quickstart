import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { VentureProfile, VentureProfileStore } from "./types.js";

// redundant, but resolves module loading order issues
import dotenv from 'dotenv';
dotenv.config();

// DynamoDB client configuration
const LOCAL_DYNAMODB_URL = process.env.LOCAL_DYNAMODB_URL;
const dynamoDBConfig = LOCAL_DYNAMODB_URL ? {
    endpoint: LOCAL_DYNAMODB_URL,
    region: 'local',
    credentials: {
        accessKeyId: 'local',
        secretAccessKey: 'local'
    }
} : {};
console.log("dynamoDBConfig", dynamoDBConfig);

// Initialize DynamoDB client
const client = new DynamoDBClient(dynamoDBConfig);
const docClient = DynamoDBDocumentClient.from(client);

// Get table name from environment variable
const TABLE_NAME = "venture-profiles";

export const ventureProfileStore: VentureProfileStore = {
    async saveVentureProfile(profile: VentureProfile): Promise<void> {
        try {
            const item = {
                ...profile,
                id: `venture-profile:${profile.did}`,
                type: "venture-profile",

                // Add timestamp for GSI sorting
                gsi1pk: "venture-profile",
                gsi1sk: profile.createdAt
            };

            await docClient.send(new PutCommand({
                TableName: TABLE_NAME,
                Item: item
            }));
        } catch (error) {
            console.error("Error saving venture profile to DynamoDB:", error);
            throw new Error(`Failed to save venture profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    async loadVentureProfile(did: string): Promise<VentureProfile | undefined> {
        try {
            const result = await docClient.send(new GetCommand({
                TableName: TABLE_NAME,
                Key: {
                    id: `venture-profile:${did}`
                }
            }));

            if (!result.Item) {
                return undefined;
            }

            // Convert DynamoDB item back to VentureProfile
            return result.Item as VentureProfile;
        } catch (error) {
            console.error("Error loading venture profile from DynamoDB:", error);
            throw new Error(`Failed to load venture profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    async deleteVentureProfile(did: string): Promise<void> {
        await docClient.send(new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id: `venture-profile:${did}` }
        }));
    },

    async queryVentureProfiles(): Promise<VentureProfile[]> {
        try {
            const result = await docClient.send(new QueryCommand({
                TableName: TABLE_NAME,
                IndexName: "TypeIndex",
                KeyConditionExpression: "type = :type",
                ExpressionAttributeValues: { ":type": "venture-profile" }
            }));

            return result.Items as VentureProfile[];
        } catch (error) {
            console.error("Error querying venture profiles from DynamoDB:", error);
            throw new Error(`Failed to query venture profiles: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
};