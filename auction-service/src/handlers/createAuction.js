require('dotenv').config();
const {v4: uuid} = require('uuid');
const createError = require('http-errors');
const commonMiddleware = require('../lib/commonMiddleware');
const {PutCommand, DynamoDBDocumentClient} = require('@aws-sdk/lib-dynamodb');
const client = require('../config/dynamoDBClient');

// Initialize DynamoDB client with marshallOptions for consistent handling
const dynamoDB = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    },
});

// Helper function to create a new auction item
function createAuctionItem(title) {
    const now = new Date();
    return {
        id: uuid(),
        title,
        status: 'OPEN',
        createdAt: now.toISOString(),
        amount: 0,
        endingAt: new Date(now.getTime() + 3600000).toISOString(), // 1 hour later
    };
}

// Main handler for creating an auction
async function createAuction(event) {
    const {title} = event.body;

    // Validate the input
    if (!title) {
        throw new createError.BadRequest('Auction title is required');
    }

    // Create auction item
    const auction = createAuctionItem(title);

    // DynamoDB parameters
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
    };

    // Attempt to write the item to DynamoDB
    try {
        await dynamoDB.send(new PutCommand(params));
    } catch (error) {
        console.error(`Failed to create auction: ${error.message || error}`);
        throw new createError.InternalServerError('Could not create auction');
    }

    return {
        statusCode: 201,
        body: JSON.stringify(auction),
    };
}

// Apply middleware for JSON parsing and error handling
module.exports.handler = commonMiddleware(createAuction);
