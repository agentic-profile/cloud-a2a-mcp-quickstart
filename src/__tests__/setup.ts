// Jest setup file
// This file runs before each test

// Set up environment variables for testing
process.env.NODE_ENV = 'test';
process.env.ENVIRONMENT = 'test';

// Mock AWS SDK if needed
jest.mock('@aws-sdk/client-lambda', () => ({
  LambdaClient: jest.fn(),
  InvokeCommand: jest.fn(),
}));

jest.mock('@aws-sdk/client-cloudformation', () => ({
  CloudFormationClient: jest.fn(),
  DescribeStacksCommand: jest.fn(),
})); 