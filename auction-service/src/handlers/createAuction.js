import AWS from 'aws-sdk';
import {v4 as uuid} from 'uuid';
import createError from 'http-errors';
import validator from '@middy/validator';

import commonMiddleware from "../lib/commonMiddleware";
import createAuctionSchema from "../lib/schemas/createAuctionSchema";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {

    const {title} = event.body;
    const now = new Date();
    const end = new Date();
    end.setHours(now.getHours() + 1);

    const auction = {
        id: uuid(),
        title,
        status: 'OPEN',
        createAt: now.toISOString(),
        endingAt: end.toISOString(),
        highestBid: {
            amount: 0,
        }
    };

    try {
        await dynamoDB.put({
            TableName: process.env.AUCTIONS_TABLE_NAME,
            Item: auction,
        }).promise();
    } catch (error) {
        console.error(error);
        throw new createError(500, error);
    }

    return {
        statusCode: 201,
        body: JSON.stringify(auction)
    };
}

export const handler = commonMiddleware(createAuction)
    .use(validator({inputSchema: createAuctionSchema}));