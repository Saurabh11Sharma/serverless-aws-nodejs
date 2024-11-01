const getAuctionsSchema = {
  type: 'object',
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['OPEN', 'CLOSED']
        }
      },
      required: ['status']
    }
  },
  required: ['queryStringParameters']
}

module.exports = getAuctionsSchema
