import { Redis, RedisOptions } from "ioredis";
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

// Redis client configuration
const REDIS_ENDPOINT = process.env.VALKEY_ENDPOINT || 'localhost';
const REDIS_PORT = parseInt(process.env.VALKEY_PORT || '6379');
const REDIS_PASSWORD_SECRET_ARN = process.env.VALKEY_PASSWORD_SECRET_ARN;
const REDIS_DB = parseInt(process.env.VALKEY_DB || '0');

// Create Redis client
let redis: Redis;
let cachedPassword: string | undefined = undefined;

/**
 * Get password from AWS Secrets Manager
 */
async function getRedisPassword(): Promise<string | undefined> {

    // allow password to be set in environment variable
    if( process.env.VALKEY_PASSWORD )
        return process.env.VALKEY_PASSWORD;

    console.log('🔍 getRedisPassword called');
    console.log(`🔍 Secret ARN: ${REDIS_PASSWORD_SECRET_ARN}`);
    
    if (!REDIS_PASSWORD_SECRET_ARN) {
        console.log('⚠️ No Redis password secret ARN provided, using no password');
        return undefined;
    }

    if (cachedPassword) {
        console.log('✅ Using cached password');
        return cachedPassword;
    }

    try {
        console.log('🔍 Creating Secrets Manager client...');
        const secretsClient = new SecretsManagerClient({ region: process.env.AWS_REGION || 'us-east-1' });
        console.log(`🔍 AWS Region: ${process.env.AWS_REGION || 'us-east-1'}`);
        
        console.log('🔍 Creating GetSecretValue command...');
        const command = new GetSecretValueCommand({
            SecretId: REDIS_PASSWORD_SECRET_ARN,
        });
        
        console.log('🔍 Sending command to Secrets Manager...');
        const response = await secretsClient.send(command);
        console.log('✅ Secrets Manager response received');
        
        if (response.SecretString) {
            console.log('🔍 Parsing secret data...');
            const secretData = JSON.parse(response.SecretString);
            cachedPassword = secretData.password;
            console.log('✅ Successfully retrieved Redis password from Secrets Manager');
            return cachedPassword;
        }
        
        throw new Error('No password found in secret');
    } catch (error) {
        console.error('❌ Error retrieving Redis password from Secrets Manager:', error);
        return undefined;
    }
}

async function getRedis() {
    if( redis )
        return redis;

    const username = 'default';
    const password = await getRedisPassword();

    console.log(`🔍 Redis endpoint: ${REDIS_ENDPOINT}`);
    console.log(`🔍 Redis port: ${REDIS_PORT}`);
    console.log(`🔍 Redis database: ${REDIS_DB}`);
    console.log(`🔍 Redis username: ${username}`);
    console.log(`🔍 Redis password: ${password?.substring(0, 4)}...`);

    const options: RedisOptions = {
        host: REDIS_ENDPOINT,
        port: REDIS_PORT,
        username,
        password,
        db: REDIS_DB,
        connectTimeout: 10000,
        maxRetriesPerRequest: 3
    };

    // Only use TLS for cloud Redis (not localhost)
    if (REDIS_ENDPOINT !== 'localhost' && REDIS_ENDPOINT !== '127.0.0.1') {
        options.tls = {};   // assume TLS for cloud Redis
    }

    console.log( "Redis options", options );
    redis = new Redis(options);

    // Add connection event handlers for better debugging
    redis.on('connect', () => {
        console.log('✅ Redis client connected');
    });

    redis.on('ready', () => {
        console.log('✅ Redis client ready');
    });

    redis.on('error', (err) => {
        console.error('❌ Redis client error:', err);
    });

    redis.on('close', () => {
        console.log('🔌 Redis client connection closed');
    });

    redis.on('reconnecting', () => {
        console.log('🔄 Redis client reconnecting...');
    });

    return redis;
}

/**
 * Store a value in Valkey with optional expiration
 * @param key - The key to store the value under
 * @param value - The value to store (will be JSON stringified)
 * @param ttl - Time to live in seconds (optional)
 */
export async function storeValue(key: string, value: any, _ttl?: number) {
    console.log(`🔍 storeValue called for key: ${key}`);
    const client = await getRedis();
    await client.set(key, JSON.stringify(value));
}

/**
 * Get a value from Redis
 * @param key - The key to retrieve
 * @returns Promise<any> - The stored value or null if not found
 */
export async function getValue(key: string): Promise<any> {
    console.log(`🔍 getValue called for key: ${key}`);

    const client = await getRedis();
    const value = await client.get(key);
    
    if (value === null) {
        console.log(`No value found for key: ${key}`);
        return null;
    }
    
    const parsedValue = JSON.parse(value);
    console.log(`Retrieved value for key: ${key}`);
    return parsedValue;
}

/**
 * Delete a value from Redis
 * @param key - The key to delete
 * @returns Promise<boolean> - True if successful, false otherwise
 */
export async function deleteValue(key: string): Promise<boolean> {
    const client = await getRedis();
    const result = await client.del(key);
    
    if (result > 0) {
        console.log(`Deleted value for key: ${key}`);
        return true;
    } else {
        console.log(`No value found to delete for key: ${key}`);
        return false;
    }
}

/**
 * Check if a key exists in Redis
 * @param key - The key to check
 * @returns Promise<boolean> - True if key exists, false otherwise
 */
export async function keyExists(key: string): Promise<boolean> {
    const client = await getRedis();
    const result = await client.exists(key);
    return result > 0;
}

/**
 * Set expiration time for an existing key
 * @param key - The key to set expiration for
 * @param ttl - Time to live in seconds
 */
export async function setExpiration(key: string, ttl: number) {
    const client = await getRedis();
    await client.expire(key, ttl);
}

/**
 * Get the time to live for a key
 * @param key - The key to check
 * @returns Promise<number> - TTL in seconds, -1 if no expiration, -2 if key doesn't exist
 */
export async function getTTL(key: string): Promise<number> {
    const client = await getRedis();
    const ttl = await client.ttl(key);
    return ttl;
}

/**
 * Close the Redis client connection
 * @returns Promise<void>
 *
export async function closeConnection(): Promise<void> {
    if (redisClient) {
        try {
            await redisClient.quit();
            redisClient = null;
            console.log('Redis connection closed');
        } catch (error) {
            console.error('Error closing Redis connection:', error);
        }
    }
}*/

/**
 * Health check for Redis connection
 * @returns Promise<boolean> - True if connection is healthy, false otherwise
 */
export async function healthCheck(): Promise<boolean> {
    const client = await getRedis();
    await client.ping();
    return true;
}
