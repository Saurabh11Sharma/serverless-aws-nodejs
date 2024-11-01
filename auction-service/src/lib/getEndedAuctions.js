require('dotenv').config();

const client = require('../config/dynamoDBClient');
const { DynamoDBDocumentClient, ScanCommand} = require('@aws-sdk/lib-dynamodb');

const dynamoDB = DynamoDBDocumentClient.from(client);

async function getEndedAuctions(event, context) {
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        FilterExpression: '#status = :status AND endingAt < :now',
        ExpressionAttributeValues: {
            ':status': 'OPEN',
            ':now': new Date().toISOString(),
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
    };

    try {
        const { Items: auctions } = await dynamoDB.send(new ScanCommand(params));
        return auctions;
    } catch (error) {
        console.error(`Failed to fetch auctions: ${error.message || error}`);
        throw new Error('Could not fetch auctions');
    }
}

module.exports = getEndedAuctions;