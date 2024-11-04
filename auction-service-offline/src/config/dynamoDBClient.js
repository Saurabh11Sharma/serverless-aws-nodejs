// src/libs/dynamodbClient.js

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Configure the DynamoDB client
const ddbClient = new DynamoDBClient({
    endpoint: process.env.DYNAMODB_ENDPOINT
});

// Create a document client
const client = DynamoDBDocumentClient.from(ddbClient);

module.exports = client;