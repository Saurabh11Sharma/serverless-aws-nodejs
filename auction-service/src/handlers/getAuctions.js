import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';

import commonMiddleware from "../lib/commonMiddleware";
import getAuctionsSchema from "../lib/schemas/getAuctionsSchema";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {

    let auctions;

    const {status} = event.queryStringParameters;

    try {
        const result = await dynamoDB.query({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            IndexName: 'statusAndEndDate',
            KeyConditionExpression: '#status = :status',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': status
            }
        }).promise();

        auctions = result.Items;

    } catch (error) {
        console.error(error);
        throw new createError(500, error);
    }

    return {
        statusCode: 201, body: JSON.stringify(auctions)
    };
}

export const handler = commonMiddleware(getAuctions)
    .use(validator(
        {
            inputSchema: getAuctionsSchema,
            ajvOptions: {
                useDefaults: true
            }
        }
    ));