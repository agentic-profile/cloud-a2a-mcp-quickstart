import serverlessExpress from '@codegenie/serverless-express';
import { app } from './router';

// AWS Lambda handler - wrapped with serverless-express
// This is the main export used when the function is deployed to AWS
export const handler = serverlessExpress({ app }); 