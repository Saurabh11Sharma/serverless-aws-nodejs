const placeBidSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                amount: {
                    type: 'number',
                    description: 'The amount of the bid. Must be greater than the current highest bid.',
                    minimum: 0 // Ensures that bids are non-negative
                }
            },
            required: ['amount'],
            additionalProperties: false // Disallow additional properties in the body
        },
    },
    required: ['body'],
    additionalProperties: false, // Disallow additional properties in the root object
    description: 'Schema for placing a bid on an auction'
};

module.exports = placeBidSchema;
