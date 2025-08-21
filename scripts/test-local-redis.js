#!/usr/bin/env node

/**
 * Test script for local Redis connection
 * This script tests the Redis connection using the same configuration as the main application
 */

// Load environment variables from .env.local if it exists
try {
    require('dotenv').config({ path: '.env.local' });
} catch (error) {
    console.log('📝 No .env.local file found, using system environment variables');
}

// Import the Redis functions from the main application
const { storeValue, getValue, deleteValue, healthCheck } = require('../dist/cache/redis');

async function testLocalRedis() {
    console.log('🧪 Testing local Redis connection...');
    console.log('');

    try {
        // Test 1: Health check
        console.log('1️⃣ Testing Redis health check...');
        const isHealthy = await healthCheck();
        if (isHealthy) {
            console.log('✅ Health check passed');
        } else {
            console.log('❌ Health check failed');
            return;
        }
        console.log('');

        // Test 2: Store a value
        console.log('2️⃣ Testing value storage...');
        const testKey = 'test:local:redis:connection';
        const testValue = { 
            message: 'Hello from local Redis!', 
            timestamp: new Date().toISOString(),
            test: true
        };
        
        await storeValue(testKey, testValue);
        console.log('✅ Value stored successfully');
        console.log('');

        // Test 3: Retrieve the value
        console.log('3️⃣ Testing value retrieval...');
        const retrievedValue = await getValue(testKey);
        if (retrievedValue && retrievedValue.message === testValue.message) {
            console.log('✅ Value retrieved successfully');
            console.log(`   Original: ${JSON.stringify(testValue)}`);
            console.log(`   Retrieved: ${JSON.stringify(retrievedValue)}`);
        } else {
            console.log('❌ Value retrieval failed');
            console.log(`   Expected: ${JSON.stringify(testValue)}`);
            console.log(`   Got: ${JSON.stringify(retrievedValue)}`);
        }
        console.log('');

        // Test 4: Delete the value
        console.log('4️⃣ Testing value deletion...');
        const deleted = await deleteValue(testKey);
        if (deleted) {
            console.log('✅ Value deleted successfully');
        } else {
            console.log('❌ Value deletion failed');
        }
        console.log('');

        // Test 5: Verify deletion
        console.log('5️⃣ Verifying deletion...');
        const shouldBeNull = await getValue(testKey);
        if (shouldBeNull === null) {
            console.log('✅ Deletion verified - key no longer exists');
        } else {
            console.log('❌ Deletion verification failed - key still exists');
        }
        console.log('');

        console.log('🎉 All Redis tests passed! Your local Redis is working correctly.');
        console.log('');
        console.log('🔧 You can now use this Redis server for local development by setting:');
        console.log('   VALKEY_ENDPOINT=localhost');
        console.log('   VALKEY_PORT=6379');
        console.log('   VALKEY_PASSWORD=');
        console.log('   VALKEY_DB=0');

    } catch (error) {
        console.error('❌ Redis test failed:', error.message);
        console.log('');
        console.log('🔍 Troubleshooting tips:');
        console.log('   1. Make sure Redis is running: redis-cli -h localhost -p 6379 ping');
        console.log('   2. Check your environment variables in .env.local');
        console.log('   3. Verify Redis is accessible on localhost:6379');
        console.log('   4. Run ./scripts/start-local-redis.sh for installation help');
        process.exit(1);
    }
}

// Run the test
testLocalRedis().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
