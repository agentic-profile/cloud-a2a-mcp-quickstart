
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Initialize Bedrock client
const bedrockClient = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || 'us-west-2'
});

// Claude 3.5 Haiku model identifier
const CLAUDE_3_5_HAIKU_MODEL_ID = 'anthropic.claude-3-5-haiku-20241022-v1:0';

export interface TextContent {
    type: "text";
    text: string;
}

export interface ClaudeMessage {
    role: "user" | "assistant";
    content: string | TextContent;
}

export async function promptCompletion(prompt: string): Promise<string> {
    const messages = [
        {
            role: "user",
            content: prompt
        } as ClaudeMessage
    ];
    return await chatCompletion(messages);
}

export async function chatCompletion(messages: ClaudeMessage[]): Promise<string> {
    try {
        // Prepare the request payload for Claude 3.5 Haiku
        const requestBody = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 4000,
            temperature: 0.7,
            messages
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
        //console.log('🤖 Claude 3.5 Haiku Response:', JSON.stringify(response, null, 4));
        const { body, contentType, ...rest } = response;
        if( contentType !== 'application/json' )
            throw new Error(`Unexpected content type: ${contentType}`);
        if( !body )
            throw new Error('No body received from Claude 3.5 Haiku');

        const responseBody = JSON.parse(new TextDecoder().decode(body));
        console.log('🤖 Claude 3.5 Haiku Response:', JSON.stringify({ responseBody, ...rest }, null, 4));
        const { type, content } = responseBody;
        if( type !== 'message' )
            throw new Error(`Unexpected type: ${type}`);
        if( !content )
            throw new Error('No content received from Claude 3.5 Haiku');
        
        // Extract the text content from Claude's response
        const text = content.find((part: any) => part.type === 'text')?.text;
        if( !text )
            throw new Error('No text content received from Claude 3.5 Haiku');
        else
            return text;

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
