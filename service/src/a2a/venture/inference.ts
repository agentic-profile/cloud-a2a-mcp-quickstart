
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-west-2'
});

// Claude 3.5 Haiku model identifier
const CLAUDE_3_5_HAIKU_MODEL_ID = 'anthropic.claude-3-5-haiku-20241022-v1:0';

export async function completion(prompt: string): Promise<string> {
    try {
        // Prepare the request payload for Claude 3.5 Haiku
        const requestBody = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 4000,
            temperature: 0.7,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        };

        // Create the invoke model command
        const command = new InvokeModelCommand({
            modelId: CLAUDE_3_5_HAIKU_MODEL_ID,
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify(requestBody)
        });

        // Invoke the model
        const response = await bedrockClient.send(command);
        
        // Parse the response
        console.log('🤖 Claude 3.5 Haiku Response:', JSON.stringify(response, null, 4));
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        // Extract the text content from Claude's response
        if (responseBody.content && responseBody.content.length > 0) {
            return responseBody.content[0].text;
        } else {
            throw new Error('No content received from Claude 3.5 Haiku');
        }

    } catch (error) {
        console.error('Error calling Claude 3.5 Haiku via Bedrock:', error);
        
        // Provide a more informative error message based on the error type
        if (error instanceof Error) {
            if (error.message.includes('AccessDeniedException')) {
                return `Error: Access denied to Claude 3.5 Haiku. Please ensure you have requested model access in the AWS Bedrock console and have the necessary IAM permissions.`;
            } else if (error.message.includes('ValidationException')) {
                return `Error: Invalid request to Claude 3.5 Haiku. Please check the model parameters.`;
            } else if (error.message.includes('ThrottlingException')) {
                return `Error: Request throttled. Please try again later.`;
            }
        }
        
        return `Error calling Claude 3.5 Haiku: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
}
