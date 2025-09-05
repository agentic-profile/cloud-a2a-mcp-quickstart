/**
 * Example usage of AWS Bedrock with Claude 3.5 Haiku
 * 
 * This example demonstrates how to use the completion function 
 * that calls Claude 3.5 Haiku via AWS Bedrock.
 */

import { completion } from '../src/a2a/venture/inference.js';

async function exampleUsage() {
    console.log('🤖 Testing AWS Bedrock with Claude 3.5 Haiku...\n');

    try {
        // Example 1: Simple question
        console.log('📝 Example 1: Simple question');
        const response1 = await completion("What is artificial intelligence?");
        console.log('Response:', response1);
        console.log('\n' + '='.repeat(50) + '\n');

        // Example 2: Creative writing
        console.log('📝 Example 2: Creative writing');
        const response2 = await completion("Write a short poem about technology and human connection.");
        console.log('Response:', response2);
        console.log('\n' + '='.repeat(50) + '\n');

        // Example 3: Problem solving
        console.log('📝 Example 3: Problem solving');
        const response3 = await completion("How can I optimize a Node.js application for better performance?");
        console.log('Response:', response3);
        console.log('\n' + '='.repeat(50) + '\n');

        // Example 4: Code explanation
        console.log('📝 Example 4: Code explanation');
        const response4 = await completion(`
            Explain this TypeScript code:
            
            const bedrockClient = new BedrockRuntimeClient({
                region: process.env.AWS_REGION || 'us-east-1'
            });
        `);
        console.log('Response:', response4);

    } catch (error) {
        console.error('❌ Error during example usage:', error);
    }
}

// Run the example if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    exampleUsage().catch(console.error);
}

export { exampleUsage };
