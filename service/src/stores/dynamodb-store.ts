import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { StoreItem, ItemStore } from "./types.js";

// redundant, but resolves module loading order issues
import dotenv from 'dotenv';
dotenv.config();

// DynamoDB client configuration for local development
const LOCAL_DYNAMODB_URL = process.env.LOCAL_DYNAMODB_URL || process.env.LOCAL_DYNAMODB;
const dynamoConfig = LOCAL_DYNAMODB_URL ? {
    endpoint: LOCAL_DYNAMODB_URL,
    region: 'local',
    credentials: {
        accessKeyId: 'local',
        secretAccessKey: 'local'
    }
} : {};
console.log("dynamoConfig", dynamoConfig);

// Initialize DynamoDB client
const client = new DynamoDBClient(dynamoConfig);
const docClient = DynamoDBDocumentClient.from(client);

export interface StoreOptions {
    tableName: string;
}

export function itemStore<T extends StoreItem>({ tableName }: StoreOptions): ItemStore<T> {
    console.log(`DynamoDB itemStore of ${tableName}`);
    return {
        name: () => tableName,
        async readItem(id: string): Promise<T | undefined> {
            try {
                const result = await docClient.send(new GetCommand({
                    TableName: tableName,
                    Key: {
                        id
                    }
                }));

                if (!result.Item) {
                    return undefined;
                }

                // Convert DynamoDB item back to VentureProfile
                return result.Item as T;
            } catch (error) {
                console.error(`Error loading ${tableName}[${id}]:`, error);
                throw new Error(`Failed to load ${tableName}[${id}]: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },

        async updateItem(item: T): Promise<void> {
            try {
                await docClient.send(new PutCommand({
                    TableName: tableName,
                    Item: item
                }));
            } catch (error) {
                console.error(`Error saving ${tableName}[${item.id}]:`, error);
                throw new Error(`Failed to save ${tableName}[${item.id}]: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },

        async deleteItem(id: string): Promise<void> {
            try {
                await docClient.send(new DeleteCommand({
                    TableName: tableName,
                    Key: { id }
                }));
            } catch (error) {
                console.error(`Error deleting ${tableName}[${id}]:`, error);
                throw new Error(`Failed to delete ${tableName}[${id}]: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },

        async queryItems(query:any): Promise<T[]> {
            try {
                const result = await docClient.send(new QueryCommand({
                    TableName: tableName,
                    ...query
                }));

                return result.Items as T[];
            } catch (error) {
                console.error(`Error querying ${JSON.stringify(query)} from DynamoDB ${tableName}:`, error);
                throw new Error(`Failed to query ${JSON.stringify(query)} from ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },

        // Requires kind and updated fields
        async recentItems( kind: string, since: string, limit: number = 100): Promise<T[]> {
            const query = {
                TableName: tableName,
                IndexName: "KindIndex",
                KeyConditionExpression: "kind = :kind AND updated >= :since",
                ExpressionAttributeValues: { 
                    ":kind": kind,
                    ":since": since
                },
                ScanIndexForward: false,
                Limit: limit
            };
            try {
                const result = await docClient.send(new QueryCommand(query));
                return result.Items as T[];
            } catch (error) {
                console.error(`Error querying ${JSON.stringify(query)} from DynamoDB ${tableName}:`, error);
                throw new Error(`Failed to query ${JSON.stringify(query)} from ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }
}
