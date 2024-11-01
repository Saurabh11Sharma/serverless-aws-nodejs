const { v4: uuid } = require('uuid');
const fs = require('fs');

const generateAuctionItem = title => {
    const now = new Date();
    return {
        PutRequest: {
            Item: {
                id: { S: uuid() },
                title: { S: title },
                status: { S: 'OPEN' },
                createdAt: { S: now.toISOString() },
                amount: { N: '0' },
                endingAt: { S: new Date(now.getTime() + 3600000).toISOString() } // 1 hour later
            }
        }
    };
};

// Generate multiple items
const items = {
    AuctionsTable: [
        generateAuctionItem('Auction Title 1'),
        generateAuctionItem('Auction Title 2'),
        generateAuctionItem('Auction Title 3'),
        // Add more items as needed
    ]
};

// Save items to a JSON file
fs.writeFileSync('items.json', JSON.stringify(items, null, 2));

console.log('items.json has been created with multiple auction items.');