// @ts-ignore
import proxy from '@codegenie/serverless-express';
import { app } from './router.js';

// AWS Lambda handler - wrapped with serverless-express
// This is the main export used when the function is deployed to AWS
// @ts-ignore
export const handler = proxy({ app }); 