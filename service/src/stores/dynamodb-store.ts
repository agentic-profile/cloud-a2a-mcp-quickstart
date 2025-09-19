import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DatedItem, ItemStore } from "./types.js";

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

export function itemStore<T extends DatedItem>(kind: string, tableName: string): ItemStore<T> {
    console.log(`DynamoDB itemStore of ${kind} in ${tableName}`);
    return {
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
                console.error(`Error loading ${kind}[${id}] from DynamoDB ${tableName}:`, error);
                throw new Error(`Failed to load ${kind}[${id}] from ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },

        async updateItem(item: T): Promise<void> {
            try {
                const itemToSave = {
                    ...item,
                    kind // needed for "updated" sort to work
                };

                await docClient.send(new PutCommand({
                    TableName: tableName,
                    Item: itemToSave
                }));
            } catch (error) {
                console.error(`Error saving ${kind}[${item.id}] to DynamoDB ${tableName}:`, error);
                throw new Error(`Failed to save ${kind}[${item.id}] to ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },

        async deleteItem(id: string): Promise<void> {
            try {
                await docClient.send(new DeleteCommand({
                    TableName: tableName,
                    Key: { id }
                }));
            } catch (error) {
                console.error(`Error deleting ${kind}[${id}] from DynamoDB ${tableName}:`, error);
                throw new Error(`Failed to delete ${kind}[${id}] from ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },

        async queryItems(): Promise<T[]> {
            try {
                const result = await docClient.send(new QueryCommand({
                    TableName: tableName,
                    IndexName: "TypeIndex",
                    KeyConditionExpression: "kind = :kind",
                    ExpressionAttributeValues: { ":kind": kind },
                }));

                return result.Items as T[];
            } catch (error) {
                console.error(`Error querying ${kind} from DynamoDB ${tableName}:`, error);
                throw new Error(`Failed to query ${kind} from ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },

        async recentItems(since: string, limit: number = 100): Promise<T[]> {
            try {
                const result = await docClient.send(new QueryCommand({
                    TableName: tableName,
                    IndexName: "TypeIndex",
                    KeyConditionExpression: "kind = :kind AND updated >= :since",
                    ExpressionAttributeValues: { 
                        ":kind": kind,
                        ":since": since
                    },
                    ScanIndexForward: false,
                    Limit: limit
                }));
                return result.Items as T[];
            } catch (error) {
                console.error(`Error querying ${kind} from DynamoDB ${tableName}:`, error);
                throw new Error(`Failed to query ${kind} from  ${tableName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    }
}
