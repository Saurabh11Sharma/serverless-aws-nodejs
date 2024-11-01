require('dotenv').config();
const createError = require('http-errors')
const validator = require('@middy/validator')
const placeBidSchema = require('../lib/schemas/placeBidSchema.js')
const commonMiddleware = require('../lib/commonMiddleware.js')

const client = require('../config/dynamoDBClient');
const { UpdateCommand, DynamoDBDocumentClient, GetCommand} = require('@aws-sdk/lib-dynamodb')

const dynamoDB = DynamoDBDocumentClient.from(client);

async function placeBid(event) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const getParams = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id }
  };

  let auction;
  try {
    const result = await dynamoDB.send(new GetCommand(getParams));
    auction = result.Item;

    if (!auction) {
      throw new createError.NotFound(`Auction with ID "${id}" not found`);
    }

    if (amount <= auction.amount) {
      throw new createError.BadRequest(
          `Your bid must be higher than the current bid of ${auction.amount}`
      );
    }
  } catch (error) {
    console.error(error);
    if (error instanceof createError.HttpError) {
      throw error;
    } else {
      throw new createError.InternalServerError(error.message);
    }
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set #amount = :amount',
    ExpressionAttributeNames: {
      '#amount': 'amount',
    },
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW'
  };

  try {
    const result = await dynamoDB.send(new UpdateCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error.message);
  }
}

module.exports.handler = commonMiddleware(placeBid)
  .use(validator({ inputSchema: placeBidSchema }))
