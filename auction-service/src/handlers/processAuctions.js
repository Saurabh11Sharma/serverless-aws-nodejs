require('dotenv').config();
const createError = require('http-errors')

const closeAuction = require('../lib/closeAuction.js')
const getEndedAuctions  = require('../lib/getEndedAuctions');

async function processAuctions (event, context) {
  try {
    const auctionsToClose = await getEndedAuctions();

    console.log(`Closing ${auctionsToClose.length} auctions`)

    const closePromises = auctionsToClose.map((auction) => closeAuction(auction))

    await Promise.all(closePromises)

    return { closed: auctionsToClose.length }
  } catch (error) {
    console.error(error)
    throw new createError.InternalServerError(error)
  }
}

module.exports.handler = processAuctions
