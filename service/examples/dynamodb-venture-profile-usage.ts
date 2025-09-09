import { ventureProfileStore } from '../src/stores/dynamodb-store.js';
import { VentureProfile } from '../src/stores/types.js';

/**
 * Example usage of the DynamoDB VentureProfileStore
 * 
 * This example demonstrates how to:
 * 1. Save a venture profile to DynamoDB
 * 2. Load a venture profile from DynamoDB
 * 3. List all items in the table
 * 4. Query venture profiles using GSI
 * 5. Handle errors appropriately
 */

async function exampleUsage() {
    try {
        // Create a sample venture profile
        const ventureProfile: VentureProfile = {
            uuid: '123e4567-e89b-12d3-a456-426614174000',
            did: 'did:example:venture123',
            name: 'TechStart Inc.',
            description: 'A revolutionary AI-powered startup focused on sustainable technology solutions.',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log('Saving venture profile...');
        await ventureProfileStore.saveVentureProfile(ventureProfile);
        console.log('✅ Venture profile saved successfully');

        // Load the venture profile
        console.log('Loading venture profile...');
        const loadedProfile = await ventureProfileStore.loadVentureProfile(ventureProfile.did);
        
        if (loadedProfile) {
            console.log('✅ Venture profile loaded successfully:');
            console.log(JSON.stringify(loadedProfile, null, 2));
        } else {
            console.log('❌ Venture profile not found');
        }

        // Try to load a non-existent profile
        console.log('Loading non-existent profile...');
        const nonExistentProfile = await ventureProfileStore.loadVentureProfile('did:example:nonexistent');
        
        if (nonExistentProfile) {
            console.log('❌ Unexpected: Found non-existent profile');
        } else {
            console.log('✅ Correctly returned undefined for non-existent profile');
        }

        // List all items in the table
        console.log('Listing all items in the table...');
        const allItems = await ventureProfileStore.listAllItems();
        console.log(`✅ Found ${allItems.length} items in the table:`);
        console.log(JSON.stringify(allItems, null, 2));

        // Query venture profiles using GSI
        console.log('Querying venture profiles using GSI...');
        const queriedProfiles = await ventureProfileStore.queryVentureProfiles();
        console.log(`✅ Found ${queriedProfiles.length} venture profiles via query:`);
        console.log(JSON.stringify(queriedProfiles, null, 2));

    } catch (error) {
        console.error('❌ Error in example usage:', error);
    }
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    exampleUsage();
}

export { exampleUsage };
