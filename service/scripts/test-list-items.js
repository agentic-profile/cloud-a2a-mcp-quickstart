#!/usr/bin/env node

/**
 * Test script to demonstrate listing all items in DynamoDB table
 * 
 * This script shows how to:
 * 1. List all items using Scan operation
 * 2. Query items using GSI
 * 3. Compare the results
 */

import { ventureProfileStore } from '../dist/stores/dynamodb-store.js';

async function testListItems() {
    console.log('🔍 Testing DynamoDB List Items Functionality\n');

    try {
        // Test 1: List all items using Scan
        console.log('=== Test 1: List All Items (Scan) ===');
        const allItems = await ventureProfileStore.listAllItems();
        console.log(`✅ Found ${allItems.length} total items in the table`);
        
        if (allItems.length > 0) {
            console.log('Sample items:');
            allItems.slice(0, 3).forEach((item, index) => {
                console.log(`  ${index + 1}. ID: ${item.id}, Type: ${item.type}, Name: ${item.name || 'N/A'}`);
            });
            if (allItems.length > 3) {
                console.log(`  ... and ${allItems.length - 3} more items`);
            }
        } else {
            console.log('  No items found in the table');
        }

        console.log('\n=== Test 2: Query Venture Profiles (GSI Query) ===');
        const profiles = await ventureProfileStore.queryVentureProfiles();
        console.log(`✅ Found ${profiles.length} venture profiles via query`);
        
        if (profiles.length > 0) {
            console.log('Venture profiles:');
            profiles.forEach((profile, index) => {
                console.log(`  ${index + 1}. ${profile.name} - ${profile.description}`);
            });
        } else {
            console.log('  No venture profiles found');
        }

        console.log('\n=== Test 3: Comparison ===');
        console.log(`Total items (Scan): ${allItems.length}`);
        console.log(`Venture profiles (Query): ${profiles.length}`);
        console.log(`Difference: ${allItems.length - profiles.length} items not returned by query`);

        // Show what types of items exist
        const itemTypes = {};
        allItems.forEach(item => {
            const type = item.type || 'unknown';
            itemTypes[type] = (itemTypes[type] || 0) + 1;
        });

        console.log('\nItem types in table:');
        Object.entries(itemTypes).forEach(([type, count]) => {
            console.log(`  ${type}: ${count} items`);
        });

    } catch (error) {
        console.error('❌ Error testing list items:', error);
        console.error('Make sure DynamoDB is running and the table exists');
        process.exit(1);
    }
}

// Run the test
testListItems();
