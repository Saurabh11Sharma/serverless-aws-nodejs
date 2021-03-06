import AWS from 'aws-sdk';
import createError from 'http-errors';
import validator from '@middy/validator';

import {getAuctionById} from "./getAuction";
import commonMiddleware from "../lib/commonMiddleware";
import placeBidSchema from "../lib/schemas/placeBidSchema";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {

    const {id} = event.pathParameters;
    const {amount} = event.body;

    const auction = await getAuctionById(id);

    if (auction.status !== 'OPEN') {
        throw new createError(403, `You can not bid on closed auctions!`);
    }

    if (amount <= auction.highestBid.amount) {
        throw new createError(403, `Bid must be higher than ${auction.highestBid.amount}!`);
    }

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: {id},
        UpdateExpression: "set highestBid.amount = :amount",
        ExpressionAttributeValues: {
            ":amount": amount
        },
        ReturnValues: "ALL_NEW"
    }

    let updatedAuction;

    try {
        const result = await dynamoDB.update(params).promise();
        updatedAuction = result.Attributes;
    } catch (error) {
        console.error(error);
        throw new createError(500, error);
    }

    return {
        statusCode: 201,
        body: JSON.stringify(updatedAuction)
    };
}

export const handler = commonMiddleware(placeBid)
    .use(validator({inputSchema: placeBidSchema}));