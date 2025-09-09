#!/usr/bin/env node

/**
 * Test script for local DynamoDB connection
 * 
 * This script tests the connection to a local DynamoDB instance
 * and verifies that the venture profile store works correctly.
 * 
 * Prerequisites:
 * 1. Local DynamoDB must be running on http://localhost:8000
 * 2. Set LOCAL_DYNAMODB=http://localhost:8000 in your .env.local file
 * 3. Run: npm run build && node scripts/test-local-dynamodb.js
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const envPath = join(projectRoot, '.env.local');

console.log('🔍 Loading environment variables from:', envPath);
dotenv.config({ path: envPath });

// Import the venture profile store
import { ventureProfileStore } from '../dist/stores/dynamodb-store.js';

async function testLocalDynamoDB() {
    console.log('🚀 Starting local DynamoDB test...');
    
    // Check if LOCAL_DYNAMODB is set
    const localDynamoDBUrl = process.env.LOCAL_DYNAMODB;
    if (!localDynamoDBUrl) {
        console.error('❌ LOCAL_DYNAMODB environment variable is not set');
        console.log('💡 Please set LOCAL_DYNAMODB=http://localhost:8000 in your .env.local file');
        process.exit(1);
    }
    
    console.log(`✅ LOCAL_DYNAMODB is set to: ${localDynamoDBUrl}`);
    
    try {
        // Test data
        const testProfile = {
            did: 'did:test:local-dynamodb-test',
            name: 'Local DynamoDB Test Profile',
            description: 'This is a test profile for local DynamoDB',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        console.log('📝 Testing venture profile operations...');
        
        // Test save
        console.log('💾 Saving test profile...');
        await ventureProfileStore.saveVentureProfile(testProfile);
        console.log('✅ Profile saved successfully');
        
        // Test load
        console.log('📖 Loading test profile...');
        const loadedProfile = await ventureProfileStore.loadVentureProfile(testProfile.did);
        if (loadedProfile) {
            console.log('✅ Profile loaded successfully');
            console.log('📋 Loaded profile:', JSON.stringify(loadedProfile, null, 2));
        } else {
            console.error('❌ Failed to load profile');
            process.exit(1);
        }
        
        // Test query
        console.log('🔍 Querying all venture profiles...');
        const profiles = await ventureProfileStore.queryVentureProfiles();
        console.log(`✅ Found ${profiles.length} profiles`);
        
        // Test delete
        console.log('🗑️ Deleting test profile...');
        await ventureProfileStore.deleteVentureProfile(testProfile.did);
        console.log('✅ Profile deleted successfully');
        
        // Verify deletion
        const deletedProfile = await ventureProfileStore.loadVentureProfile(testProfile.did);
        if (!deletedProfile) {
            console.log('✅ Profile deletion verified');
        } else {
            console.error('❌ Profile still exists after deletion');
            process.exit(1);
        }
        
        console.log('🎉 All tests passed! Local DynamoDB is working correctly.');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        console.log('\n💡 Troubleshooting tips:');
        console.log('1. Make sure local DynamoDB is running: java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb');
        console.log('2. Verify LOCAL_DYNAMODB=http://localhost:8000 in your .env.local file');
        console.log('3. Check that the table exists in your local DynamoDB');
        console.log('4. Run: aws dynamodb list-tables --endpoint-url http://localhost:8000');
        process.exit(1);
    }
}

// Run the test
testLocalDynamoDB().catch(console.error);
