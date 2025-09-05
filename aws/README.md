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
