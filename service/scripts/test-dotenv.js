#!/usr/bin/env node

/**
 * Test script to verify dotenv configuration
 * This script tests that environment variables are loaded correctly from .env files
 */

// Load environment variables from .env files
import dotenv from 'dotenv';

// Try to load from .env.local first, then fall back to .env
try {
    dotenv.config({ path: '.env.local' });
    console.log('📝 Loaded environment variables from .env.local');
} catch (error) {
    try {
        dotenv.config({ path: '.env' });
        console.log('📝 Loaded environment variables from .env');
    } catch (error2) {
        console.log('📝 No .env files found, using system environment variables');
    }
}

console.log('🧪 Testing dotenv configuration...');
console.log('');

// Test environment variables
const testVars = [
    'PORT',
    'VALKEY_ENDPOINT',
    'VALKEY_PORT',
    'VALKEY_PASSWORD',
    'VALKEY_DB',
    'AWS_REGION'
];

console.log('📋 Environment variables:');
testVars.forEach(varName => {
    const value = process.env[varName];
    if (value !== undefined) {
        console.log(`   ${varName}=${value}`);
    } else {
        console.log(`   ${varName}=undefined`);
    }
});

console.log('');
console.log('✅ Dotenv configuration test completed!');
console.log('');
console.log('💡 To create a .env file, copy env.local.example to .env and customize the values.');
