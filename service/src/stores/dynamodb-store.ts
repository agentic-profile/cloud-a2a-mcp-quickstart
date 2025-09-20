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
    name: string;
    kind?: string;
}

export function itemStore<T extends StoreItem>({ tableName, name, kind }: StoreOptions): ItemStore<T> {
    const label = `${kind}${name} in ${tableName}`;
    console.log(`DynamoDB itemStore of ${label}`);
    return {
        name: () => name,
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
                console.error(`Error loading ${label}[${id}]:`, error);
                throw new Error(`Failed to load ${label}[${id}]: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },

        async updateItem(item: T): Promise<void> {
            try {
                const itemToSave = kind ? {
                    ...item,
                    kind // usually needed for "updated" sort to work
                } : item;

                await docClient.send(new PutCommand({
                    TableName: tableName,
                    Item: itemToSave
                }));
            } catch (error) {
                console.error(`Error saving ${label}[${item.id}]:`, error);
                throw new Error(`Failed to save ${label}[${item.id}]: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },

        async deleteItem(id: string): Promise<void> {
            try {
                await docClient.send(new DeleteCommand({
                    TableName: tableName,
                    Key: { id }
                }));
            } catch (error) {
                console.error(`Error deleting ${label}[${id}]:`, error);
                throw new Error(`Failed to delete ${label}[${id}]: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        },

        async queryItems(query:any): Promise<T[]> {
            try {
                const result = await docClient.send(new QueryCommand({
                    TableName: tableName,
                    IndexName: "TypeIndex",
                    ...query
                    //KeyConditionExpression: "kind = :kind",
                    //ExpressionAttributeValues: { ":kind": kind },
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
