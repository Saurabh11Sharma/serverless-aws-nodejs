const client = require('../config/dynamoDBClient');
const {DynamoDBDocumentClient, ScanCommand} = require('@aws-sdk/lib-dynamodb');

const dynamoDB = DynamoDBDocumentClient.from(client);

async function getEndedAuctions(event, context) {
    // Ensure the table name is set
    const tableName = process.env.AUCTIONS_TABLE_NAME;
    if (!tableName) {
        throw new Error('AUCTIONS_TABLE_NAME environment variable is not set.');
    }

    const now = Date.now(); // Get the current timestamp in milliseconds
    const params = {
        TableName: tableName,
        FilterExpression: '#status = :status AND endingAt < :now',
        ExpressionAttributeValues: {
            ':status': 'OPEN',
            ':now': now, // Use the timestamp for comparison
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
    };

    try {
        const {Items: auctions} = await dynamoDB.send(new ScanCommand(params));
        console.log(`Fetched ${auctions.length} ended auctions.`);
        return auctions;
    } catch (error) {
        console.error(`Failed to fetch auctions: ${error.message || error}`);
        throw new Error(`Could not fetch auctions: ${error.message || error}`);
    }
}

module.exports = getEndedAuctions;
