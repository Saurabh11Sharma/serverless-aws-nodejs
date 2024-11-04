const createError = require('http-errors');
const client = require('../config/dynamoDBClient');
const {UpdateCommand, DynamoDBDocumentClient} = require('@aws-sdk/lib-dynamodb');

const dynamoDB = DynamoDBDocumentClient.from(client);

async function closeAuction(event, context) {
    // Validate the input
    const {id} = event.pathParameters || {}; // Assuming the ID comes from path parameters

    if (!id) {
        throw new createError.BadRequest('Auction ID is required.');
    }

    // Ensure the table name is set
    const tableName = process.env.AUCTIONS_TABLE_NAME;
    if (!tableName) {
        throw new createError.InternalServerError('AUCTIONS_TABLE_NAME environment variable is not set.');
    }

    const params = {
        TableName: tableName,
        Key: {id},
        UpdateExpression: 'SET #status = :status',
        ExpressionAttributeValues: {
            ':status': 'CLOSED',
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ReturnValues: 'ALL_NEW',
    };

    try {
        const {Attributes: updatedAuction} = await dynamoDB.send(new UpdateCommand(params));

        if (!updatedAuction) {
            throw new createError.NotFound(`Auction with ID ${id} not found.`);
        }

        console.log(`Auction with ID ${id} has been closed successfully.`);

        return {
            statusCode: 200,
            body: JSON.stringify(updatedAuction),
        };
    } catch (error) {
        console.error(`Failed to update auction with ID ${id}: ${error.message || error}`);
        throw new createError.InternalServerError(`Failed to update auction: ${error.message || error}`);
    }
}

module.exports = closeAuction;
