# How to List All Items in a DynamoDB Table

This document explains the different methods available to list items in a DynamoDB table, with examples specific to this codebase.

## Available Methods

### 1. **Scan Operation** - List ALL Items (Recommended)

The `Scan` operation reads all items in a table or secondary index. This is the most straightforward way to list all items.

**Usage:**
```typescript
import { ventureProfileStore } from './stores/dynamodb-store.js';

// List all items in the table
const allItems = await ventureProfileStore.listAllItems();
console.log(`Found ${allItems.length} items:`, allItems);
```

**Implementation:**
```typescript
async listAllItems(): Promise<any[]> {
    try {
        const result = await docClient.send(new ScanCommand({
            TableName: TABLE_NAME
        }));
        return result.Items || [];
    } catch (error) {
        console.error("Error scanning all items from DynamoDB:", error);
        throw new Error(`Failed to scan all items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
```

**Pros:**
- Returns ALL items in the table
- Simple to use
- No need to know specific key values

**Cons:**
- Can be expensive for large tables (reads every item)
- May be throttled for very large tables
- No filtering capabilities (unless you add FilterExpression)

### 2. **Query Operation** - List Items by GSI (Current Implementation)

The `Query` operation finds items based on primary key or GSI key values. Currently implemented to query by type.

**Usage:**
```typescript
// Query venture profiles using GSI
const profiles = await ventureProfileStore.queryVentureProfiles();
console.log(`Found ${profiles.length} venture profiles:`, profiles);
```

**Implementation:**
```typescript
async queryVentureProfiles(): Promise<VentureProfile[]> {
    try {
        const result = await docClient.send(new QueryCommand({
            TableName: TABLE_NAME,
            IndexName: "TypeIndex",
            KeyConditionExpression: "#type = :type",
            ExpressionAttributeNames: { "#type": "type" },
            ExpressionAttributeValues: { ":type": "startup" }
        }));
        return result.Items as VentureProfile[];
    } catch (error) {
        console.error("Error querying venture profiles from DynamoDB:", error);
        throw new Error(`Failed to query venture profiles: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
```

**Pros:**
- Very efficient (uses index)
- Can filter by specific criteria
- Fast for targeted queries

**Cons:**
- Limited to items matching the key condition
- Requires knowledge of key values
- Current implementation only returns items with `type = "startup"`

### 3. **MCP Tool Interface** - Via JSON-RPC

You can also list items through the MCP (Model Context Protocol) interface:

**Available Tools:**
- `list-all`: Lists all items in the table
- `query`: Lists venture profiles using GSI query

**Usage via MCP:**
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
        "name": "list-all"
    }
}
```

**Response:**
```json
{
    "jsonrpc": "2.0",
    "id": 1,
    "result": {
        "content": [
            {
                "type": "text",
                "text": "{\"items\": [...], \"count\": 5}"
            }
        ]
    }
}
```

## Advanced Scanning Options

### Pagination for Large Tables

For tables with many items, you should implement pagination:

```typescript
async listAllItemsPaginated(): Promise<any[]> {
    const allItems: any[] = [];
    let lastEvaluatedKey: any = undefined;

    do {
        const result = await docClient.send(new ScanCommand({
            TableName: TABLE_NAME,
            ExclusiveStartKey: lastEvaluatedKey,
            Limit: 100 // Process 100 items at a time
        }));

        if (result.Items) {
            allItems.push(...result.Items);
        }

        lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    return allItems;
}
```

### Filtering During Scan

You can add filters to the scan operation:

```typescript
async listItemsWithFilter(): Promise<any[]> {
    const result = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "begins_with(#type, :typePrefix)",
        ExpressionAttributeNames: { "#type": "type" },
        ExpressionAttributeValues: { ":typePrefix": "venture" }
    }));

    return result.Items || [];
}
```

## Performance Considerations

### Scan vs Query

| Operation | Use Case | Performance | Cost |
|-----------|----------|-------------|------|
| **Scan** | List ALL items | Slower for large tables | Higher (reads all items) |
| **Query** | List items by key | Fast (uses index) | Lower (only reads matching items) |

### Best Practices

1. **Use Query when possible** - Much more efficient than Scan
2. **Implement pagination** - For large tables to avoid timeouts
3. **Add filters** - Reduce the amount of data returned
4. **Consider GSI design** - Create indexes for common query patterns
5. **Monitor costs** - Scan operations can be expensive

## Example: Complete Usage

```typescript
import { ventureProfileStore } from './stores/dynamodb-store.js';

async function demonstrateListing() {
    try {
        // Method 1: List all items (Scan)
        console.log('=== All Items (Scan) ===');
        const allItems = await ventureProfileStore.listAllItems();
        console.log(`Total items: ${allItems.length}`);
        allItems.forEach((item, index) => {
            console.log(`${index + 1}. ${item.name || item.id} (${item.type})`);
        });

        // Method 2: Query by type (Query with GSI)
        console.log('\n=== Venture Profiles (Query) ===');
        const profiles = await ventureProfileStore.queryVentureProfiles();
        console.log(`Venture profiles: ${profiles.length}`);
        profiles.forEach((profile, index) => {
            console.log(`${index + 1}. ${profile.name} - ${profile.description}`);
        });

    } catch (error) {
        console.error('Error listing items:', error);
    }
}

// Run the example
demonstrateListing();
```

## Running the Example

To test the listing functionality:

```bash
# Navigate to the service directory
cd service

# Run the example
npm run build
node dist/examples/dynamodb-venture-profile-usage.js
```

This will demonstrate both the scan and query operations with sample data.
