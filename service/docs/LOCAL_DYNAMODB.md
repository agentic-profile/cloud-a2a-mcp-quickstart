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
