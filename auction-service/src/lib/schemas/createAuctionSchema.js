const createAuctionSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    minLength: 1,  // Ensures that the title is not an empty string
                    description: 'The title of the auction, must be a non-empty string.'
                },
            },
            required: ['title'],  // Title is mandatory
            additionalProperties: false // Disallow other properties
        }
    },
    required: ['body'], // Body is mandatory
    additionalProperties: false, // Disallow other properties in the root object
    description: 'Schema for creating an auction'
};

module.exports = createAuctionSchema;
