# Cloud A2A and MCP Quickstart

Leverages cloud formation scripts and templates to create a scalable server with example A2A and MCP services.

## Features

For each cloud infrastructure, scripts can optimize with VPCs, NATs, caches, scalable databases, scalable
compute, native security, and different AI model providers.

Demonstrates [Universal Authentication](https://universalauth.org) using DIDs, JWT, and standard HTTPS headers.  

The A2A and MCP services are written in Javascript/Typescript using Node.js and have abstracted
storage to map to the cloud native data stores.

Example A2A agents include:
- Venture: an agent that learns about a startup and helps that startup find the right technology providers, capital partners, teamates, and co-founders.
- Business Match: an MCP that learns about all the ventures and the people that might want to work with them and suggests connections.
- Volunteer: an agent that learns about a volunteer and helps them find volunteering opportunities
- Charity: an agent that learns about a charity and helps them find volunteers
- Reputation: an MCP that learns about peoples and business reputations
- Volunteer Match: an MCP that learns about volunteers and charities and suggests matches

The demo website is written using React and converted to a static website which can be deployed
to an edge caching service.

### Cloud Providers

Support for various cloud providers:
  - AWS: [simple deployment on AWS](./service/README.md) using CloudFormation

## Development

Suports local development with these dependencies:

- git
- Node.js 22+
- Redis

### Quickstart

1. Make sure Redis is installed and running

- Install Redis
- Start Redis locally

  ```bash
  redis-server
  ```

2. Clone the repo and change dir into it

```bash
git clone git@github.com:agentic-profile/cloud-a2a-mcp-quickstart.git
cd cloud-a2a-mcp-quickstart
```

3. Start the website service locally

```bash
cd website
npm install
npm run dev
```

4. Start the A2A and MCP server locally

```bash
cd service
npm install
npm run dev
```

5. Open the website with your browser, visit http://localhost:5173

Example usage:

- Create an Agentic Profile so your agents can authenticate
    - Click "Settings", then "Manage" on the Digital Identity row
    - Enter your name, then click "Create Digital Identity"
- Click MCP in the navigation bar
    - Click the "Test" button under Location
    - Click "Update Location"


## Cloud Deployment

The /website and /service projects are designed to be generic and easy to deploy on cloud infrastructure.

Currently AWS CloudFormation scripts are available, and other cloud providers such as Google Cloud and Azure should be easy to implement.

### Deploy to AWS using CloudFormation

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


## Project Structure

```
├── aws/                      # AWS deployment scripts and CloudFormation templates
│   ├── agentic-foundation.yaml    # Foundation infrastructure template
│   ├── agentic-service.yaml       # Service deployment template
│   ├── agentic-website.yaml       # Website deployment template
│   ├── deploy-service.sh          # Service deployment script
│   ├── deploy-website.sh          # Website deployment script
│   └── ssh-nat-instance.sh        # NAT instance SSH script
├── service/                  # A2A and MCP Backend service (Node.js/TypeScript)
│   ├── src/
│   │   ├── index.ts              # Main Lambda function
│   │   ├── index.local.ts        # Local development server
│   │   ├── router.ts             # Express router with all endpoints
│   │   ├── a2a/                  # A2A TaskHandler implementations
│   │   │   ├── hireme/           # HireMe task handlers
│   │   │   ├── venture/          # Venture task handlers
│   │   │   ├── vc/               # VC task handlers
│   │   │   ├── index.ts          # A2A main exports
│   │   │   └── utils.ts          # A2A utilities and middleware
│   │   ├── mcp/                  # MCP protocol implementations
│   │   │   ├── location/         # Location-related MCP methods
│   │   │   ├── match/            # Matching MCP methods
│   │   │   └── utils.ts          # MCP utilities
│   │   ├── json-rpc/             # JSON-RPC protocol handling
│   │   │   ├── auth.ts           # Authentication
│   │   │   ├── index.ts          # JSON-RPC main handler
│   │   │   ├── types.ts          # Type definitions
│   │   │   └── utils.ts          # JSON-RPC utilities
│   │   ├── cache/                # Redis caching layer
│   │   │   └── redis.ts          # Redis client and utilities
│   │   ├── stores/               # Data storage abstractions
│   │   │   └── memory-store.ts   # In-memory storage implementation
│   │   └── __tests__/            # Unit tests
│   ├── www/                      # Static web files for the landing page
│   │   ├── index.html            # Web interface HTML
│   │   └── images/               # Static images and icons
│   ├── docs/                     # Service documentation
│   ├── scripts/                  # Helper scripts
│   ├── examples/                 # Usage examples
│   ├── dist/                     # Compiled JavaScript output
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
└── website/                  # Frontend React application
    ├── src/
    │   ├── App.tsx               # Main React application
    │   ├── main.tsx              # Application entry point
    │   ├── components/           # Reusable React components
    │   ├── pages/                # Page components
    │   │   ├── agents/           # Agent-related pages
    │   │   └── mcp/              # MCP-related pages
    │   ├── stores/               # State management (Zustand)
    │   ├── assets/               # Static assets (images, etc.)
    │   └── data/                 # Static data files
    ├── public/                   # Public static files
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── postcss.config.js
```

## Useful CURL commands for local testing

### Health Check
```bash
curl -X GET http://localhost:3000/status
```

### MCP Location Service
```bash
# Tools List
curl -X POST http://localhost:3000/mcp/location \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'

# Location Update
curl -X POST http://localhost:3000/mcp/location \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":4,"method":"update","params":{"coords":{"latitude":35.6762,"longitude":139.6503}}}'

# Location Query
curl -X POST http://localhost:3000/mcp/location \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":5,"method":"query"}'
```

### A2A Endpoints
```bash
# HireMe TaskHandler
curl -X POST http://localhost:3000/a2a/hireme \
  -H 'Content-Type: application/json' \
  -d '{"id":"1","method":"tasks/send","params":{"position":"Senior Engineer"},"includeAllUpdates":true}'

# Venture TaskHandler
curl -X POST http://localhost:3000/a2a/venture \
  -H 'Content-Type: application/json' \
  -d '{"id":"1","method":"venture/create","params":{"name":"Test Venture","type":"startup"}}'

# VC TaskHandler
curl -X POST http://localhost:3000/a2a/vc \
  -H 'Content-Type: application/json' \
  -d '{"id":"1","method":"task/send","params":{"investment":"1000000"}}'
```

### Production Environment
For production deployment, ensure Lambda endpoint is known:

```bash
export AGENTIC_HOST=https://ierurztomh.execute-api.us-west-2.amazonaws.com/dev
```

Then use the same endpoints with the production host.


