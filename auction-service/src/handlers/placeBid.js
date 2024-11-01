require('dotenv').config();
const createError = require('http-errors');
const validator = require('@middy/validator');
const placeBidSchema = require('../lib/schemas/placeBidSchema.js');
const commonMiddleware = require('../lib/commonMiddleware.js');

const client = require('../config/dynamoDBClient');
const {UpdateCommand, DynamoDBDocumentClient, GetCommand} = require('@aws-sdk/lib-dynamodb');

// Create the DynamoDB Document Client
const dynamoDB = DynamoDBDocumentClient.from(client);

// Main handler for placing a bid on an auction
async function placeBid(event) {
    const {id} = event.pathParameters;
    const {amount} = event.body;

    console.log('saurabh sharma')

    const auction = await getAuctionById(id);
    validateBidAmount(amount, auction.amount);

    await updateAuctionBidAmount(id, amount);

    return {
        statusCode: 200,
        body: JSON.stringify({message: 'Bid placed successfully', newAmount: amount}),
    };
}

// Helper function to retrieve an auction by ID
async function getAuctionById(id) {
    const getParams = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {id},
    };

    try {
        const result = await dynamoDB.send(new GetCommand(getParams));
        const auction = result.Item;

        if (!auction) {
            throw new createError.NotFound(`Auction with ID "${id}" not found`);
        }

        return auction;
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError('Failed to retrieve auction');
    }
}

// Helper function to validate the bid amount
function validateBidAmount(amount, currentAmount) {
    if (amount <= currentAmount) {
        throw new createError.BadRequest(`Your bid must be higher than the current bid of ${currentAmount}`);
    }
}

// Helper function to update the auction's bid amount
async function updateAuctionBidAmount(id, amount) {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {id},
        UpdateExpression: 'set #amount = :amount',
        ExpressionAttributeNames: {
            '#amount': 'amount',
        },
        ExpressionAttributeValues: {
            ':amount': amount,
        },
        ReturnValues: 'ALL_NEW',
    };

    try {
        await dynamoDB.send(new UpdateCommand(params));
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError('Failed to update auction bid amount');
    }
}

// Export the handler with common middleware and validation applied
module.exports.handler = commonMiddleware(placeBid);
