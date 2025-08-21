# Redis Connection Troubleshooting Guide

This guide helps resolve Redis connection timeout issues in the Agentic Profile MCP Lambda function.

## Problem

The Lambda function is experiencing Redis connection timeouts:
```
Redis client error: ConnectionTimeoutError: Connection timeout
```

## Root Cause

The Lambda function is not properly configured to access the Valkey (Redis-compatible) cache because:

1. **Lambda is not in VPC**: The Lambda function runs outside the VPC where the cache is deployed
2. **Missing VPC Configuration**: Lambda needs to be in the same VPC as the cache
3. **Network Access**: Lambda needs proper subnet and security group configuration

## Solution

### 1. Update Infrastructure

The CloudFormation templates have been updated to:

- **Add VPC Configuration**: Lambda now runs in the same VPC as the cache
- **Add Security Groups**: Lambda has proper network access to the cache
- **Export Network Resources**: Foundation stack exports VPC and subnet IDs

### 2. Redeploy Infrastructure

```bash
# Deploy the updated foundation stack
npm run foundation:up

# Deploy the updated Lambda function
npm run deploy
```

### 3. Verify Configuration

Check that the Lambda function has the correct environment variables:

```bash
# Get Lambda function configuration
aws lambda get-function-configuration --function-name agentic-profile-mcp-dev
```

Expected environment variables:
- `VALKEY_ENDPOINT`: Valkey cache endpoint
- `VALKEY_PORT`: Valkey cache port (usually 6379)
- `VALKEY_PASSWORD_SECRET_ARN`: ARN of the password secret

### 4. Test Redis Connection

Use the provided test script:

```bash
# Set environment variables (get from Lambda function)
export VALKEY_ENDPOINT="your-valkey-endpoint"
export VALKEY_PORT="6379"
export VALKEY_PASSWORD_SECRET_ARN="your-secret-arn"
export AWS_REGION="us-east-1"

# Test Redis connection
npm run test:redis
```

### 5. Check Network Configuration

Verify that the Lambda function is in the correct VPC:

```bash
# Get Lambda function details
aws lambda get-function --function-name agentic-profile-mcp-dev

# Check VPC configuration
aws lambda get-function-configuration --function-name agentic-profile-mcp-dev --query 'VpcConfig'
```

### 6. Monitor Logs

Check CloudWatch logs for connection issues:

```bash
# Tail Lambda logs
aws logs tail /aws/lambda/agentic-profile-mcp-dev --follow
```

## Additional Improvements

### Connection Resilience

The Redis client has been improved with:

- **Retry Logic**: 3 connection attempts with 1-second delays
- **Connection Timeouts**: 10-second connect timeout, 5-second command timeout
- **Graceful Degradation**: Functions continue working even if Redis is unavailable
- **Connection Health Checks**: Automatic reconnection when needed

### Error Handling

- **Non-blocking Errors**: Redis failures don't crash the application
- **Detailed Logging**: Better error messages for debugging
- **Fallback Behavior**: Functions return sensible defaults when Redis is down

## Troubleshooting Steps

### 1. Check Foundation Stack

```bash
# Verify foundation stack is running
npm run foundation:status

# Check foundation stack outputs
aws cloudformation describe-stacks \
  --stack-name agentic-foundation-dev \
  --query 'Stacks[0].Outputs'
```

### 2. Check Lambda VPC Configuration

```bash
# Verify Lambda is in VPC
aws lambda get-function-configuration \
  --function-name agentic-profile-mcp-dev \
  --query 'VpcConfig'
```

### 3. Test Network Connectivity

```bash
# Test from Lambda to Valkey (requires Lambda shell access)
# This can be done through AWS Systems Manager Session Manager
```

### 4. Check Security Groups

```bash
# Verify security group allows Lambda to access Valkey
aws ec2 describe-security-groups \
  --group-ids $(aws lambda get-function-configuration \
    --function-name agentic-profile-mcp-dev \
    --query 'VpcConfig.SecurityGroupIds' \
    --output text)
```

### 5. Check Secrets Manager

```bash
# Verify password secret exists and is accessible
aws secretsmanager describe-secret \
  --secret-id $(aws lambda get-function-configuration \
    --function-name agentic-profile-mcp-dev \
    --query 'Environment.Variables.VALKEY_PASSWORD_SECRET_ARN' \
    --output text)
```

## Common Issues

### Issue: Lambda cannot access Secrets Manager
**Solution**: Ensure Lambda execution role has `secretsmanager:GetSecretValue` permission

### Issue: Lambda cannot access Valkey cache
**Solution**: Verify Lambda is in the same VPC and has proper security group access

### Issue: Connection timeouts persist
**Solution**: 
1. Check if Valkey cache is running
2. Verify endpoint and port are correct
3. Test network connectivity
4. Check security group rules

### Issue: Cold start timeouts
**Solution**: 
1. Increase Lambda timeout (currently 30 seconds)
2. Use connection pooling
3. Implement connection caching

## Monitoring

### CloudWatch Metrics

Monitor these metrics:
- `Duration`: Lambda execution time
- `Errors`: Function errors
- `Throttles`: Function throttling
- `Invocations`: Function invocations

### Custom Metrics

Consider adding custom metrics for:
- Redis connection success/failure rates
- Redis operation latency
- Cache hit/miss ratios

## Best Practices

1. **Use Connection Pooling**: Reuse Redis connections across invocations
2. **Implement Circuit Breaker**: Prevent cascading failures
3. **Add Health Checks**: Regular Redis connectivity tests
4. **Monitor Performance**: Track Redis operation metrics
5. **Plan for Failures**: Design for graceful degradation

## Support

If issues persist:

1. Check CloudWatch logs for detailed error messages
2. Verify all infrastructure components are running
3. Test Redis connectivity manually
4. Review security group and VPC configurations
5. Consider increasing timeouts for cold starts 