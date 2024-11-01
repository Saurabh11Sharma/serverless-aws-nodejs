const {v4: uuid} = require('uuid');
const fs = require('fs');

/**
 * Generates an auction item object.
 *
 * @param {string} title - The title of the auction item.
 * @returns {Object} - The auction item in DynamoDB format.
 */
const generateAuctionItem = (title) => {
    const now = new Date();
    return {
        PutRequest: {
            Item: {
                id: {S: uuid()},
                title: {S: title},
                status: {S: 'OPEN'},
                createdAt: {S: now.toISOString()},
                amount: {N: '0'},
                endingAt: {S: new Date(now.getTime() + 3600000).toISOString()} // 1 hour later
            }
        }
    };
};

/**
 * Generates multiple auction items.
 *
 * @param {number} count - The number of auction items to generate.
 * @returns {Object} - An object containing the auction items.
 */
const generateAuctionItems = (count) => {
    const items = {AuctionsTable: []};
    for (let i = 1; i <= count; i++) {
        items.AuctionsTable.push(generateAuctionItem(`Auction Title ${i}`));
    }
    return items;
};

/**
 * Saves the auction items to a JSON file.
 *
 * @param {Object} items - The auction items to save.
 * @param {string} filename - The name of the file to save the items in.
 */
const saveItemsToFile = (items, filename) => {
    fs.writeFileSync(filename, JSON.stringify(items, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log(`${filename} has been created with multiple auction items.`);
    });
};

// Generate and save auction items
const itemCount = 10; // Change this to generate more items
const auctionItems = generateAuctionItems(itemCount);
saveItemsToFile(auctionItems, 'items.json');
