const getAuctionSchema = {
    type: 'object',
    properties: {
        queryStringParameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['OPEN', 'CLOSED'],
                    default: 'OPEN'
                },
            }
        }
    },
    required: ['queryStringParameters']
}

export default getAuctionSchema;