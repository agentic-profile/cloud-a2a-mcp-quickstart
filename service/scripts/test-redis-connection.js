#!/usr/bin/env node

/**
 * Test Redis connection script
 * This script helps debug Redis connectivity issues
 */

const { createClient } = require('redis');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

// Configuration from environment
const REDIS_ENDPOINT = process.env.VALKEY_ENDPOINT;
const REDIS_PORT = parseInt(process.env.VALKEY_PORT || '6379');
const REDIS_PASSWORD_SECRET_ARN = process.env.VALKEY_PASSWORD_SECRET_ARN;
const REDIS_DB = parseInt(process.env.VALKEY_DB || '0');

console.log('🔍 Redis Connection Test');
console.log('========================');
console.log(`Endpoint: ${REDIS_ENDPOINT}`);
console.log(`Port: ${REDIS_PORT}`);
console.log(`Database: ${REDIS_DB}`);
console.log(`Password Secret ARN: ${REDIS_PASSWORD_SECRET_ARN}`);
console.log('');

async function getRedisPassword() {
    if (!REDIS_PASSWORD_SECRET_ARN) {
        console.log('⚠️  No Redis password secret ARN provided');
        return undefined;
    }

    try {
        const secretsClient = new SecretsManagerClient({ 
            region: process.env.AWS_REGION || 'us-east-1' 
        });
        const command = new GetSecretValueCommand({
            SecretId: REDIS_PASSWORD_SECRET_ARN,
        });
        
        const response = await secretsClient.send(command);
        
        if (response.SecretString) {
            const secretData = JSON.parse(response.SecretString);
            console.log('✅ Successfully retrieved Redis password from Secrets Manager');
            return secretData.password;
        }
        
        throw new Error('No password found in secret');
    } catch (error) {
        console.error('❌ Error retrieving Redis password from Secrets Manager:', error);
        return undefined;
    }
}

async function testConnection() {
    try {
        console.log('🔗 Attempting to connect to Redis...');
        
        const password = await getRedisPassword();
        
        const client = createClient({
            socket: {
                host: REDIS_ENDPOINT || 'localhost',
                port: REDIS_PORT,
                connectTimeout: 10000,
            },
            password: password,
            database: REDIS_DB,
        });

        // Handle connection events
        client.on('error', (err) => {
            console.error('❌ Redis client error:', err);
        });

        client.on('connect', () => {
            console.log('✅ Connected to Redis');
        });

        client.on('disconnect', () => {
            console.log('⚠️  Disconnected from Redis');
        });

        // Connect to Redis
        await client.connect();
        
        // Test basic operations
        console.log('🧪 Testing basic Redis operations...');
        
        // Test PING
        const pingResult = await client.ping();
        console.log(`✅ PING response: ${pingResult}`);
        
        // Test SET/GET
        const testKey = 'test:connection';
        const testValue = { timestamp: new Date().toISOString(), test: true };
        
        await client.set(testKey, JSON.stringify(testValue));
        console.log('✅ SET operation successful');
        
        const retrievedValue = await client.get(testKey);
        const parsedValue = JSON.parse(retrievedValue);
        console.log('✅ GET operation successful');
        console.log(`📦 Retrieved value: ${JSON.stringify(parsedValue, null, 2)}`);
        
        // Clean up
        await client.del(testKey);
        console.log('✅ DEL operation successful');
        
        // Close connection
        await client.quit();
        console.log('✅ Connection closed successfully');
        
        console.log('');
        console.log('🎉 All Redis tests passed!');
        
    } catch (error) {
        console.error('❌ Redis connection test failed:', error);
        console.log('');
        console.log('🔧 Troubleshooting tips:');
        console.log('1. Check if the Valkey cache is running');
        console.log('2. Verify the endpoint and port are correct');
        console.log('3. Ensure the Lambda function is in the same VPC as the cache');
        console.log('4. Check security group configurations');
        console.log('5. Verify the password secret exists and is accessible');
        process.exit(1);
    }
}

// Run the test
testConnection(); 