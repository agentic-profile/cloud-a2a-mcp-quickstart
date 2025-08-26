# Local Development Guide

This guide explains how to set up and run the application locally with a local Redis server.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Redis server installed and running locally

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Redis manually:**
   ```bash
   # Check if Redis is already running
   ./scripts/start-local-redis.sh
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp env.local.example .env.local
   
   # Edit .env.local if needed (defaults should work)
   ```

4. **Test Redis connection:**
   ```bash
   npm run test:local-redis
   ```

5. **Start local server:**
   ```bash
   npm run start:local
   ```

## Redis Installation

### macOS (using Homebrew)
```bash
brew install redis
brew services start redis
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### CentOS/RHEL
```bash
sudo yum install redis
sudo systemctl start redis
sudo systemctl enable redis
```

### Windows
- Download from [Redis for Windows](https://github.com/microsoftarchive/redis/releases)
- Or use WSL2 with Ubuntu instructions above

## Environment Variables

Create a `.env.local` file with these settings:

```bash
# Redis connection (same variables for local and production)
VALKEY_ENDPOINT=localhost
VALKEY_PORT=6379
VALKEY_PASSWORD=
VALKEY_DB=0

# Local server port
PORT=3000
```

## Available Scripts

- `./scripts/start-local-redis.sh` - Check Redis status and show installation help
- `./scripts/stop-local-redis.sh` - Instructions for stopping Redis
- `./scripts/remove-local-redis.sh` - Instructions for uninstalling Redis
- `npm run test:local-redis` - Test local Redis connection
- `npm run start:local` - Start local development server

## Testing

### Test Redis Connection
```bash
npm run test:local-redis
```

This will:
1. Test Redis health check
2. Store a test value
3. Retrieve the value
4. Delete the value
5. Verify deletion

### Test Local Server
```bash
npm run start:local
```

Then visit `http://localhost:3000` in your browser or use tools like curl/Postman.

## Troubleshooting

### Redis Connection Issues

1. **Check if Redis is running:**
   ```bash
   redis-cli -h localhost -p 6379 ping
   ```
   Should return `PONG`

2. **Check Redis service status:**
   ```bash
   # macOS
   brew services list | grep redis
   
   # Linux
   sudo systemctl status redis-server
   # or
   sudo systemctl status redis
   ```

3. **Check Redis logs:**
   ```bash
   # macOS
   tail -f /usr/local/var/log/redis.log
   
   # Linux
   sudo journalctl -u redis-server -f
   # or
   sudo journalctl -u redis -f
   ```

### Common Issues

- **Port 6379 already in use:** Another Redis instance or service is using the port
- **Connection refused:** Redis is not running or not listening on localhost:6379
- **Permission denied:** Redis configuration issues or firewall blocking

### Redis Configuration

Default Redis configuration should work for local development. If you need to customize:

- **macOS:** `/usr/local/etc/redis.conf`
- **Linux:** `/etc/redis/redis.conf`
- **Windows:** Redis installation directory

## Development Workflow

1. **Start Redis service** (if not already running)
2. **Set environment variables** in `.env.local`
3. **Test Redis connection** with `npm run test:local-redis`
4. **Start development server** with `npm run start:local`
5. **Make code changes** - server will need restart for TypeScript changes
6. **Test changes** through the local server
7. **Stop Redis service** when done (optional)

## Switching Between Local and Cloud

To switch between local Redis and cloud Redis, simply change the environment variables:

```bash
# Use local Redis
export VALKEY_ENDPOINT=localhost
export VALKEY_PORT=6379
export VALKEY_PASSWORD=
export VALKEY_DB=0

# Use cloud Redis
export VALKEY_ENDPOINT=your-cloud-redis-endpoint
export VALKEY_PORT=6379
export VALKEY_PASSWORD_SECRET_ARN=your-secret-arn
export VALKEY_DB=0
```

## Performance Considerations

- Local Redis is much faster than cloud Redis for development
- No network latency or AWS costs during development
- Redis data persists between application restarts
- Consider using different Redis databases for different environments

## Security Notes

- Local Redis has no authentication by default (development only)
- Don't use local Redis configuration in production
- Redis data is stored locally and not encrypted
- Consider setting a password for local Redis if needed
