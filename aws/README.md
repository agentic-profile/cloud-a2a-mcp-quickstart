# Deploying A2A and MCP on AWS

This /aws folder contains CloudFormation scripts to set up and manage a network that hosts
A2A and MCP services.

This is designed to be a **subjectively** reliable, scalable, and available system.  Your needs
may vary and the scripts can easily be modified to increase fault-tolerance, for instance, by adding
additional NATs to availability zones.  Your network administrator will be able to balance the needs
of the business and the costs for each possible solution.

## Prerequisites

1. Amazon Bedrock requires manually requesting model access.

- In the AWS Console, under Amazon Bedrock, go to "Model Access"
- Tap "Modify model access"
- Select the model(s) you would like to access (e.g. Claude 3.5 Haiku)
- Tap "Submit"
- The model access page will show "In Progress" for your model access
- Make sure you have received access before trying to execute the agent-service.yaml script

## Quickstart

1. Create the foundation services that one or more agentic projects may need.  Includes the VPC, subnets, Internet Gateways, NAT, Valkey(Redis), deployment S3 buckets, and server-to-server secret support.

```bash
cd aws
npm run foundation:up
```

2. Start the A2A and MCP service, and the demo website service

```bash
cd aws
npm run service:deploy
npm run website:deploy
```

3. View the Cloudformation logs to determine the URLs for both the A2A/MCP service, and the website service

## Environment Variables

The deployment scripts support environment variables through `.env` files for easier configuration management.

### Using .env Files

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file with your specific values:
   ```bash
   # Required: Environment name (e.g., dev, staging, prod)
   ENVIRONMENT=staging
   
   # Required: Project name (defaults to 'demo' if not set)
   PROJECT=demo
   
   # Optional: AWS Region (defaults to us-east-1 if not set)
   AWS_REGION=us-west-2
   
   # Optional: Certificate ARN for HTTPS
   CERTIFICATE_ARN=arn:aws:acm:us-east-1:123456789012:certificate/your-cert-id
   
   # Optional: Base domain name for the website
   # The actual domain will be automatically prefixed based on environment and project:
   # - staging: {PROJECT}-staging.{DOMAIN_NAME}
   # - prod: {PROJECT}.{DOMAIN_NAME}
   # - other: {DOMAIN_NAME} (defaults to demo.agenticprofile.ai)
   DOMAIN_NAME=agenticprofile.ai
   ```

3. Run the deployment script (environment variables will be loaded automatically):
   ```bash
   ./deploy-website.sh
   ```

### Priority Order

Configuration values are resolved in the following priority order:
1. Command-line arguments (highest priority)
2. Environment variables from `.env` file
3. Default values (lowest priority)

### Command-line Usage

You can still override any values using command-line arguments:
```bash
./deploy-website.sh dev myproject
```
