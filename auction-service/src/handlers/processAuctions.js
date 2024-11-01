require('dotenv').config();
const createError = require('http-errors');

const closeAuction = require('../lib/closeAuction.js');
const getEndedAuctions = require('../lib/getEndedAuctions');

// Main function to process auctions that have ended
async function processAuctions(event, context) {
    try {
        const auctionsToClose = await getEndedAuctions();

        console.log(`Found ${auctionsToClose.length} auctions ready to close`);

        if (auctionsToClose.length === 0) {
            console.log('No auctions to close at this time');
            return {closed: 0};
        }

        const closePromises = auctionsToClose.map(auction => closeAuction(auction));

        // Use Promise.allSettled to handle errors individually
        const closeResults = await Promise.allSettled(closePromises);

        const closedCount = closeResults.filter(result => result.status === 'fulfilled').length;

        console.log(`Successfully closed ${closedCount} auctions`);
        return {closed: closedCount};
    } catch (error) {
        console.error('Error processing auctions:', error);
        throw new createError.InternalServerError('Failed to process auctions');
    }
}

// Export the handler
module.exports.handler = processAuctions;
