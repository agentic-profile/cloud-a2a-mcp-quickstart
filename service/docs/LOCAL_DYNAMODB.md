# Running DynamoDB locally

1. Download from https://docs.aws.amazon.com/amazondynamodb
2. Extract zip to a directory
3. Start DynamoDB

```bash
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

4. Connect to the local DynamoDB

```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

This command will return a list of all tables in your local DynamoDB instance. If you haven't created any tables yet, it will return an empty list.

5. Configure your application to use local DynamoDB

Set the `LOCAL_DYNAMODB` environment variable in your `.env.local` file:

```bash
LOCAL_DYNAMODB=http://localhost:8000
```

This will configure the DynamoDB client to connect to your local DynamoDB instance instead of AWS.


6. Creating tables

```bash
aws dynamodb create-table \
  --table-name venture-profiles \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=kind,AttributeType=S \
    AttributeName=updated,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    'IndexName=TypeIndex,KeySchema=[{AttributeName=kind,KeyType=HASH},{AttributeName=updated,KeyType=RANGE}],Projection={ProjectionType=ALL}' \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000
```

```bash
aws dynamodb delete-table \
    --endpoint-url http://localhost:8000 \
    --table-name venture-profiles
```

```bash
aws dynamodb scan \
    --endpoint-url http://localhost:8000 \
    --table-name venture-profiles
```

## AWS CLI Commands Reference

### List Tables

**Local DynamoDB:**
```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000
```

**Production DynamoDB:**
```bash
aws dynamodb list-tables
```

Both commands will return a JSON response with a `TableNames` array containing all available tables.

### Describe Table Structure

**Local DynamoDB:**
```bash
aws dynamodb describe-table \
    --table-name venture-profiles \
    --endpoint-url http://localhost:8000
```

**Production DynamoDB:**
```bash
aws dynamodb describe-table --table-name venture-profiles
```

This command provides detailed information about the table structure, including attributes, indexes, and configuration.

### Check Table Status

**Local DynamoDB:**
```bash
aws dynamodb describe-table \
    --table-name venture-profiles \
    --endpoint-url http://localhost:8000 \
    --query 'Table.TableStatus'
```

**Production DynamoDB:**
```bash
aws dynamodb describe-table \
    --table-name venture-profiles \
    --query 'Table.TableStatus'
```

This returns just the table status (e.g., "ACTIVE", "CREATING", "DELETING").


