require('dotenv').config();
const createError = require('http-errors');
const commonMiddleware = require('../lib/commonMiddleware');
const client = require('../config/dynamoDBClient');
const {GetCommand, DynamoDBDocumentClient} = require('@aws-sdk/lib-dynamodb');

// Create the DynamoDB Document Client
const dynamoDB = DynamoDBDocumentClient.from(client);

// Helper function to get an auction by its ID
async function getAuctionById(id) {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {id}
    };

    try {
        const {Item: auction} = await dynamoDB.send(new GetCommand(params));

        if (!auction) {
            throw new createError.NotFound(`Auction with id ${id} not found`);
        }

        return auction;
    } catch (error) {
        console.error(`Failed to get auction: ${error.message || error}`);
        throw new createError.InternalServerError(`Failed to get auction: ${error.message || error}`);
    }
}

// Main handler for getting an auction
async function getAuction(event) {
    const {id} = event.pathParameters;

    // Validate that an id was provided
    if (!id) {
        throw new createError.BadRequest('Auction ID is required');
    }

    try {
        const auction = await getAuctionById(id);
        return {
            statusCode: 200,
            body: JSON.stringify(auction),
        };
    } catch (error) {
        console.error(`Error retrieving auction: ${error.message}`);
        return {
            statusCode: error.statusCode || 500,
            body: JSON.stringify({message: error.message}),
        };
    }
}

// Export the handler with common middleware applied
module.exports.handler = commonMiddleware(getAuction);
