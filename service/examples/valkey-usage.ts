import { storeValue, getValue, deleteValue, keyExists, healthCheck } from '../src/cache/valkey';

/**
 * Example usage of Valkey cache with CloudFormation configuration
 */
async function exampleUsage() {
    console.log('Starting Valkey cache example...');

    // Check if the cache is healthy
    const isHealthy = await healthCheck();
    console.log('Cache health check:', isHealthy ? 'PASSED' : 'FAILED');

    if (!isHealthy) {
        console.error('Cache is not healthy, exiting...');
        return;
    }

    // Example 1: Store a user profile
    const userProfile = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john.doe@example.com',
        preferences: {
            theme: 'dark',
            notifications: true
        },
        createdAt: new Date().toISOString()
    };

    const stored = await storeValue('user:123', userProfile, 3600); // 1 hour TTL
    console.log('Stored user profile:', stored ? 'SUCCESS' : 'FAILED');

    // Example 2: Retrieve the user profile
    const retrievedProfile = await getValue('user:123');
    console.log('Retrieved user profile:', retrievedProfile);

    // Example 3: Check if a key exists
    const exists = await keyExists('user:123');
    console.log('User profile exists:', exists);

    // Example 4: Store session data
    const sessionData = {
        sessionId: 'sess-456',
        userId: 'user-123',
        lastActivity: new Date().toISOString(),
        permissions: ['read', 'write']
    };

    await storeValue('session:sess-456', sessionData, 1800); // 30 minutes TTL

    // Example 5: Store multiple related items
    const cacheItems = [
        { key: 'config:app', value: { version: '1.0.0', features: ['cache', 'auth'] }, ttl: 7200 },
        { key: 'stats:daily', value: { date: '2024-01-15', requests: 1500, errors: 5 }, ttl: 86400 },
        { key: 'temp:processing', value: { jobId: 'job-789', status: 'running' }, ttl: 300 }
    ];

    for (const item of cacheItems) {
        await storeValue(item.key, item.value, item.ttl);
        console.log(`Stored ${item.key}`);
    }

    // Example 6: Retrieve and display all items
    for (const item of cacheItems) {
        const value = await getValue(item.key);
        console.log(`Retrieved ${item.key}:`, value);
    }

    // Example 7: Delete a temporary item
    const deleted = await deleteValue('temp:processing');
    console.log('Deleted temp item:', deleted ? 'SUCCESS' : 'FAILED');

    // Example 8: Verify deletion
    const stillExists = await keyExists('temp:processing');
    console.log('Temp item still exists:', stillExists);

    console.log('Example completed successfully!');
}

/**
 * Error handling example
 */
async function errorHandlingExample() {
    console.log('\nTesting error handling...');

    try {
        // Try to get a non-existent key
        const nonExistent = await getValue('non:existent:key');
        console.log('Non-existent key result:', nonExistent); // Should be null

        // Try to delete a non-existent key
        const deleteResult = await deleteValue('non:existent:key');
        console.log('Delete non-existent key result:', deleteResult); // Should be false

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

/**
 * Main function
 */
async function main() {
    try {
        await exampleUsage();
        await errorHandlingExample();
    } catch (error) {
        console.error('Example failed:', error);
        process.exit(1);
    }
}

// Run the example if this file is executed directly
if (require.main === module) {
    main();
}

export { exampleUsage, errorHandlingExample }; 