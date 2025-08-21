#!/bin/bash

# Script to provide instructions for stopping local Redis server

echo "🛑 Instructions for stopping local Redis server..."

echo "📋 To stop your manually installed Redis server:"
echo ""
echo "   On macOS (using Homebrew):"
echo "     brew services stop redis"
echo ""
echo "   On Ubuntu/Debian/CentOS/RHEL:"
echo "     sudo systemctl stop redis-server"
echo "     # or"
echo "     sudo systemctl stop redis"
echo ""
echo "   On Windows:"
echo "     Stop the Redis service from Services or Task Manager"
echo ""
echo "🔍 To check if Redis is still running:"
echo "   redis-cli -h localhost -p 6379 ping"
echo ""
echo "🚀 To start Redis again:"
echo "   On macOS: brew services start redis"
echo "   On Linux: sudo systemctl start redis-server"
echo "   On Windows: Start the Redis service from Services"
echo ""
echo "✅ After stopping Redis, run ./scripts/start-local-redis.sh to verify it's stopped"
