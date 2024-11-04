const {v4: uuidv4} = require('uuid');
const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, BatchWriteCommand} = require('@aws-sdk/lib-dynamodb');

// Setup DynamoDB client for local environment
const client = DynamoDBDocumentClient.from(
    new DynamoDBClient({
        region: 'us-east-1',
        endpoint: 'http://localhost:8000',
        credentials: {
            accessKeyId: 'dummy',
            secretAccessKey: 'dummy',
        },
    })
);

function generateAuctionItems(count) {
    const items = [];
    for (let i = 0; i < count; i++) {
        items.push({
            id: uuidv4(),
            title: `Auction Item ${i + 1}`,
            amount: 0,
            status: 'OPEN',
            createdAt: new Date().toISOString(),
            endingAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
        });
    }
    return items;
}

const items = generateAuctionItems(10); // Generate 10 items

async function batchWriteItems() {
    const params = {
        RequestItems: {
            AuctionsTable: items.map(item => ({
                PutRequest: {
                    Item: item,
                },
            })),
        },
    };

    try {
        await client.send(new BatchWriteCommand(params));
        console.log('Batch write succeeded.');
    } catch (error) {
        console.error('Batch write failed:', error);
    }
}

batchWriteItems();