# AWS Bedrock with Claude 3.5 Haiku Integration

This guide explains how to use AWS Bedrock to call the Claude 3.5 Haiku model in your application.

## Overview

AWS Bedrock is a fully managed service that provides access to foundation models from leading AI companies through a single API. Claude 3.5 Haiku is Anthropic's fastest and most cost-effective model, perfect for real-time applications and high-volume use cases.

## Prerequisites

### 1. AWS Bedrock Model Access

**IMPORTANT**: You must request access to Claude 3.5 Haiku in the AWS Bedrock console before using it.

1. Go to the [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
2. Navigate to "Model Access" in the left sidebar
3. Click "Modify model access"
4. Find "Anthropic" in the list and select "Claude 3.5 Haiku"
5. Click "Submit"
6. Wait for approval (usually takes a few minutes to hours)

### 2. AWS Credentials

Your Lambda function will use the IAM role permissions. For local development, ensure you have AWS credentials configured:

```bash
aws configure
# OR
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
export AWS_REGION=us-east-1
```

## Implementation

### 1. Dependencies

The following dependency has been added to `package.json`:

```json
{
  "dependencies": {
    "@aws-sdk/client-bedrock-runtime": "^3.0.0"
  }
}
```

### 2. Completion Function

The `completion` function in `src/a2a/venture/inference.ts` handles all the Bedrock API calls:

```typescript
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export async function completion(prompt: string): Promise<string> {
    // Implementation handles:
    // - Bedrock client initialization
    // - Request formatting for Claude 3.5 Haiku
    // - Error handling and retries
    // - Response parsing
}
```

### 3. Model Configuration

Current settings for Claude 3.5 Haiku:

- **Model ID**: `anthropic.claude-3-5-haiku-20241022-v1:0`
- **Max Tokens**: 4,000
- **Temperature**: 0.7 (adjustable for creativity vs consistency)
- **API Version**: `bedrock-2023-05-31`

## Usage Examples

### Basic Usage

```typescript
import { completion } from '../src/a2a/venture/inference.js';

const response = await completion("What is artificial intelligence?");
console.log(response);
```

### Advanced Usage with Error Handling

```typescript
try {
    const response = await completion("Explain quantum computing");
    console.log('Claude response:', response);
} catch (error) {
    console.error('Error:', error.message);
}
```

### Running the Example

```bash
cd service
npm run build
node examples/bedrock-claude-usage.js
```

## Configuration Options

### Environment Variables

- `AWS_REGION`: AWS region for Bedrock (defaults to 'us-east-1')
- `NODE_ENV`: Environment (staging/prod)

### Model Parameters (Customizable)

You can modify these in the `completion` function:

```typescript
const requestBody = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 4000,        // Increase for longer responses
    temperature: 0.7,        // 0.0-1.0 (lower = more consistent)
    messages: [
        {
            role: "user",
            content: prompt
        }
    ]
};
```

## Error Handling

The implementation includes comprehensive error handling:

### Common Errors and Solutions

1. **AccessDeniedException**
   - **Cause**: Model access not granted or insufficient IAM permissions
   - **Solution**: Request model access in Bedrock console and verify IAM permissions

2. **ValidationException**
   - **Cause**: Invalid request parameters
   - **Solution**: Check model ID, token limits, and request format

3. **ThrottlingException**
   - **Cause**: Rate limits exceeded
   - **Solution**: Implement exponential backoff or reduce request frequency

4. **ModelNotReadyException**
   - **Cause**: Model is still being provisioned
   - **Solution**: Wait and retry, or check model availability

## IAM Permissions

The CloudFormation template includes the necessary permissions:

```yaml
- PolicyName: BedrockAccess
  PolicyDocument:
    Version: '2012-10-17'
    Statement:
      - Effect: Allow
        Action:
          - bedrock:InvokeModel
          - bedrock:InvokeModelWithResponseStream
        Resource: 
          - !Sub 'arn:aws:bedrock:${AWS::Region}::foundation-model/anthropic.claude-3-5-haiku-20241022-v1:0'
          - !Sub 'arn:aws:bedrock:${AWS::Region}::foundation-model/anthropic.claude-*'
```

## Cost Optimization

Claude 3.5 Haiku pricing (as of 2024):
- **Input**: $0.25 per million tokens
- **Output**: $1.25 per million tokens

### Tips to Reduce Costs

1. **Optimize prompts**: Be concise and specific
2. **Set appropriate max_tokens**: Don't request more than needed
3. **Cache responses**: Store frequently requested responses
4. **Monitor usage**: Use CloudWatch to track token consumption

## Performance Considerations

### Response Times
- Claude 3.5 Haiku: ~1-3 seconds for typical responses
- Factors affecting speed: prompt length, response length, region

### Best Practices
1. **Timeout settings**: Lambda timeout set to 30 seconds (configurable)
2. **Memory allocation**: 256MB (increase if processing large prompts)
3. **Connection pooling**: Bedrock client is reused across invocations
4. **Error retry**: Built-in AWS SDK retry logic

## Monitoring and Debugging

### CloudWatch Logs

The function logs all requests and responses:

```typescript
console.log('🤖 Calling Claude 3.5 Haiku with prompt:', prompt);
console.log('✅ Received response:', response);
```

### CloudWatch Metrics

Monitor these Bedrock metrics:
- `Invocations`: Number of model calls
- `InputTokenCount`: Tokens in requests
- `OutputTokenCount`: Tokens in responses
- `InvocationLatency`: Response time

## Troubleshooting

### Local Development

For local testing, make sure:
1. AWS credentials are configured
2. Region is set correctly
3. Model access is granted in your AWS account

```bash
# Test AWS credentials
aws bedrock list-foundation-models --region us-east-1

# Test the completion function locally
npm run dev
```

### Production Deployment

1. Deploy the updated CloudFormation stack:
   ```bash
   cd aws
   npm run service:deploy
   ```

2. Check Lambda logs:
   ```bash
   aws logs tail /aws/lambda/agentic-service-a2a-mcp-demo-staging --follow
   ```

## Advanced Features

### Streaming Responses

For real-time streaming (not implemented in current version):

```typescript
import { BedrockRuntimeClient, InvokeModelWithResponseStreamCommand } from '@aws-sdk/client-bedrock-runtime';

// Stream responses for better user experience
const streamCommand = new InvokeModelWithResponseStreamCommand({
    modelId: CLAUDE_3_5_HAIKU_MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(requestBody)
});
```

### System Prompts

Add system context to guide Claude's behavior:

```typescript
const requestBody = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 4000,
    temperature: 0.7,
    system: "You are a helpful assistant for startup ventures.",
    messages: [
        {
            role: "user",
            content: prompt
        }
    ]
};
```

## Support and Resources

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Anthropic Claude Documentation](https://docs.anthropic.com/)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/)
- [Claude 3.5 Model Card](https://www.anthropic.com/claude)

## Security Best Practices

1. **Least Privilege**: Only grant necessary Bedrock permissions
2. **Input Validation**: Sanitize user inputs before sending to Claude
3. **Rate Limiting**: Implement application-level rate limiting
4. **Audit Logging**: Log all AI interactions for compliance
5. **Data Privacy**: Be mindful of sensitive data in prompts
