#!/bin/bash

# Script to check if local Redis server is running for development
# This script will verify that Redis is accessible on localhost:6379

set -e

echo "🔍 Checking local Redis server status..."

# Check if Redis is running on localhost:6379
if redis-cli -h localhost -p 6379 ping > /dev/null 2>&1; then
    echo "✅ Local Redis server is running and accessible!"
    echo "🔍 Redis connection test successful"
    
    # Get Redis info
    echo ""
    echo "📋 Redis server information:"
    redis-cli -h localhost -p 6379 info server | grep -E "(redis_version|uptime_in_seconds|connected_clients)"
    
    echo ""
    echo "🔧 To use this Redis server, set these environment variables:"
    echo "   export VALKEY_ENDPOINT=localhost"
    echo "   export VALKEY_PORT=6379"
    echo "   export VALKEY_PASSWORD="
    echo "   export VALKEY_DB=0"
    echo ""
    echo "📖 Or copy env.local.example to .env.local and customize it"
    
else
    echo "❌ Local Redis server is not accessible on localhost:6379"
    echo ""
    echo "📋 To install and start Redis manually:"
    echo ""
    echo "   On macOS (using Homebrew):"
    echo "     brew install redis"
    echo "     brew services start redis"
    echo ""
    echo "   On Ubuntu/Debian:"
    echo "     sudo apt update"
    echo "     sudo apt install redis-server"
    echo "     sudo systemctl start redis-server"
    echo "     sudo systemctl enable redis-server"
    echo ""
    echo "   On CentOS/RHEL:"
    echo "     sudo yum install redis"
    echo "     sudo systemctl start redis"
    echo "     sudo systemctl enable redis"
    echo ""
    echo "   On Windows:"
    echo "     Download from https://github.com/microsoftarchive/redis/releases"
    echo "     Or use WSL2 with Ubuntu instructions above"
    echo ""
    echo "🔍 After installation, run this script again to verify the connection"
    echo ""
    echo "📖 For more information, visit: https://redis.io/download"
    exit 1
fi
