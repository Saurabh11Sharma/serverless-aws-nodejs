const getAuctionsSchema = {
    type: 'object',
    properties: {
        queryStringParameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['OPEN', 'CLOSED'], // Valid statuses for auctions
                    description: 'The status of the auctions to retrieve. Must be either "OPEN" or "CLOSED".'
                }
            },
            required: ['status'],  // required properties
            additionalProperties: false // Disallow additional properties in queryStringParameters
        }
    },
    required: ['queryStringParameters'], // queryStringParameters is mandatory
    additionalProperties: false, // Disallow additional properties in the root object
    description: 'Schema for retrieving auctions based on query parameters'
};

module.exports = getAuctionsSchema;
