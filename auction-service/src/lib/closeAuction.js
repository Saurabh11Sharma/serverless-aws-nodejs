require('dotenv').config();
const createError = require('http-errors');
const client = require('../config/dynamoDBClient');
const { UpdateCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const dynamoDB = DynamoDBDocumentClient.from(client);

async function closeAuction(event, context) {
  const { id } = event;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
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
    const { Attributes: updatedAuction } = await dynamoDB.send(new UpdateCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify(updatedAuction),
    };
  } catch (error) {
    console.error(`Failed to update auction: ${error.message || error}`);
    throw new createError.InternalServerError(`Failed to update auction: ${error.message || error}`);
  }
}

module.exports = closeAuction;