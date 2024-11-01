require('dotenv').config();
const createError = require('http-errors');
const commonMiddleware = require('../lib/commonMiddleware');

const client = require('../config/dynamoDBClient');
const { GetCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const dynamoDB = DynamoDBDocumentClient.from(client);

async function getAuctionById(id) {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id }
  };

  try {
    const { Item: auction } = await dynamoDB.send(new GetCommand(params));

    if (!auction) {
      throw new createError.NotFound(`Auction with id ${id} not found`);
    }

    return auction;
  } catch (error) {
    console.error(`Failed to get auction: ${error.message || error}`);
    throw new createError.InternalServerError(`Failed to get auction: ${error.message || error}`);
  }
}

async function getAuction(event, context) {
  const { id } = event.pathParameters;

  try {
    const auction = await getAuctionById(id);

    return {
      statusCode: 200,
      body: JSON.stringify(auction),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
}

module.exports.handler = commonMiddleware(getAuction);