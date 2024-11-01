require('dotenv').config();
const { v4: uuid } = require('uuid');
const createError = require('http-errors');
const commonMiddleware = require('../lib/commonMiddleware');

const client = require('../config/dynamoDBClient');
const { PutCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const dynamoDB = DynamoDBDocumentClient.from(client);

async function createAuction(event, context) {
    const { title } = event.body;
    const now = new Date();

    const auction = {
        id: uuid(),
        title,
        status: 'OPEN',
        createdAt: now.toISOString(),
        amount: 0,
        endingAt: new Date(now.getTime() + 3600000).toISOString(), // 1 hour later
    };

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Item: auction,
    };

    try {
        await dynamoDB.send(new PutCommand(params));
    } catch (error) {
        console.error(`Failed to create auction: ${error.message || error}`);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 201,
        body: JSON.stringify(auction),
    };
}

module.exports.handler = commonMiddleware(createAuction);