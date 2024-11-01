const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');

// Function to create DynamoDB client with error handling
function createDynamoDBClient() {
    const {AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, DYNAMODB_ENDPOINT} = process.env;

    // Validate required environment variables
    if (!AWS_REGION) {
        throw new Error('AWS_REGION is required');
    }

    const clientConfig = {
        region: AWS_REGION,
        endpoint: DYNAMODB_ENDPOINT || undefined, // Set endpoint only if provided
    };

    // Only add credentials if they are provided
    if (AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
        clientConfig.credentials = {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        };
    }

    return new DynamoDBClient(clientConfig);
}

const client = createDynamoDBClient();

module.exports = client;
