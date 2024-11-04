const createError = require('http-errors');
const commonMiddleware = require('../lib/commonMiddleware.js');
const client = require('../config/dynamoDBClient');
const {ScanCommand, DynamoDBDocumentClient} = require('@aws-sdk/lib-dynamodb');

// Create the DynamoDB Document Client
const dynamoDB = DynamoDBDocumentClient.from(client);

// Main handler for fetching auctions based on status
async function getAuctions(event) {
    const {status} = event.queryStringParameters || {};

    // Validate query string parameter 'status'
    validateStatus(status);

    const tableName = process.env.AUCTIONS_TABLE_NAME;
    if (!tableName) {
        throw new createError.InternalServerError('Server configuration issue: AUCTIONS_TABLE_NAME is not set');
    }

    const params = {
        TableName: tableName,
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {'#status': 'status'},
        ExpressionAttributeValues: {':status': status},
    };

    try {
        const {Items: auctions} = await dynamoDB.send(new ScanCommand(params));

        if (!auctions || auctions.length === 0) {
            console.warn('No auctions found with the specified status');
        }

        return {
            statusCode: 200,
            body: JSON.stringify(auctions || []), // Ensure response is always an array
        };
    } catch (error) {
        console.error('Error querying the DynamoDB table:', error);
        throw new createError.InternalServerError('Failed to fetch auctions');
    }
}

// Helper function to validate the status parameter
function validateStatus(status) {
    if (!status || !['OPEN', 'CLOSED'].includes(status)) {
        console.error('Invalid or missing status query parameter');
        throw new createError.BadRequest('Status query parameter is required and must be either OPEN or CLOSED');
    }
}

// Export the handler with common middleware applied
module.exports.handler = commonMiddleware(getAuctions);
