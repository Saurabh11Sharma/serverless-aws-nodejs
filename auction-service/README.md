# 🏷️ Auction Service

## ✍️ Author
**Name:** Saurabh Sharma

## 📜 Project Description
The **Auction Service** is a serverless application built using AWS Lambda, DynamoDB. It allows users to create and manage auctions. The service includes endpoints to create auctions, place bids, and retrieve auction details. It leverages the **Serverless Framework** for deployment and integration with local development tools such as **LocalStack** and **DynamoDB Local**.

## 📬 Endpoints

### 1. 🆕 Create Auction
**Endpoint:** POST `/auction`

**Request Body:**
```json
{
  "title": "Auction Title"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "Auction Title",
  "description": "Auction Description",
  "amount": 0,
  "status": "OPEN",
  "createdAt": "2023-09-01T12:34:56.789Z"
}
```

### 2. 📄 Get Auctions
**Endpoint:** GET `/auctions`

**Response:**
```json
[
  {
    "id": "string",
    "title": "Auction Title",
    "description": "Auction Description",
    "amount": 100,
    "status": "OPEN",
    "createdAt": "2023-09-01T12:34:56.789Z"
  }
]
```

### 3. 🔍 Get Auction
**Endpoint:** GET `/auction/{id}`

**Path Parameters:**
- `id`: The unique identifier of the auction.

**Response:**
```json
{
  "id": "string",
  "title": "Auction Title",
  "description": "Auction Description",
  "amount": 100,
  "status": "OPEN",
  "createdAt": "2023-09-01T12:34:56.789Z"
}
```

### 4. 💸 Place Bid
**Endpoint:** PATCH `/auction/{id}/bid`

**Path Parameters:**
- `id`: The unique identifier of the auction.

**Request Body:**
```json
{
  "amount": 150
}
```

**Response:**
```json
{
  "id": "string",
  "title": "Auction Title",
  "description": "Auction Description",
  "amount": 100,
  "status": "OPEN",
  "createdAt": "2023-09-01T12:34:56.789Z"
}
```

## 🚀 Running the Code Locally

To run the Auction Service locally, follow these steps:

### 💻 Prerequisites
- **Node.js** (>= 16.x)
- **Serverless Framework** (`npm install -g serverless`)
- **AWS CLI**
- **LocalStack** (for local AWS services)

## ❓ FAQs

### 1. **How do I change the DynamoDB table name?**
Modify the `AUCTIONS_TABLE_NAME` environment variable in the `serverless.yml` file.

### 2. **What if I encounter permission errors?**
Ensure your IAM role has the correct permissions and is correctly referenced in the `serverless.yml` file.

### 3. **How do I add more environment variables?**
Add them under the `environment` section in the `serverless.yml` file.

### 4. **How can I add more endpoints?**
Define new functions under the `functions` section in the `serverless.yml` file and specify the HTTP event triggers.

### 5. **How do I deploy to AWS?**
Make sure you have the AWS CLI configured with the necessary permissions, then run:
```bash
serverless deploy
```

### 6. **Where can I view the logs?**
View logs using the Serverless Framework:
```bash
serverless logs -f <functionName> -t
```

## 📝 Notes
- Ensure you have proper access and permissions configured for AWS CLI.
- Modify the configurations and parameters as per your development environment requirements.

### Step 1: Start LocalStack

LocalStack is a fully functional local AWS cloud stack. Start it with the following Docker command to run services like S3, Lambda, DynamoDB locally:
```sh
docker run --rm -p 4566:4566 -e SERVICES=lambda,dynamodb -e DEBUG=1 localstack/localstack
```

To create the DynamoDB Table:
```sh
aws dynamodb create-table --table-name AuctionsTable --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 --endpoint-url http://localhost:4566
```

### Step 2: Start the Application
```sh
npm run start
```

### Step 3: Check Table Created
To check the DynamoDB Tables:
```sh
aws dynamodb list-tables --endpoint-url=http://localhost:4566
```

### Insert Data

Run the following command to insert data:
```sh
node generateItems.js
```

To batch write items to the DynamoDB Table:
```sh
aws dynamodb batch-write-item --request-items file://items.json --endpoint-url=http://localhost:4566
```

To scan the DynamoDB Table:
```sh
aws dynamodb scan --table-name AuctionsTable --limit 5 --endpoint-url=http://localhost:4566
```
OR

```sh
aws dynamodb scan --table-name AuctionsTable --endpoint-url http://localhost:4566
```

### Final Command Set to Start
```sh
docker run --rm -p 4566:4566 -d -e SERVICES=lambda,dynamodb -e DEBUG=1 localstack/localstack; Start-Sleep -Seconds 10; aws dynamodb create-table --table-name AuctionsTable --attribute-definitions AttributeName=id,AttributeType=S AttributeName=status,AttributeType=S AttributeName=endDate,AttributeType=N --key-schema AttributeName=id,KeyType=HASH --global-secondary-indexes '[{\"IndexName\": \"statusAndEndDate\",\"KeySchema\":[{\"AttributeName\":\"status\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"endDate\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}}]' --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url=http://localhost:4566; Start-Sleep -Seconds 5; aws dynamodb batch-write-item --request-items file://items.json --endpoint-url=http://localhost:4566; Start-Sleep -Seconds 5; aws dynamodb scan --table-name AuctionsTable --limit 5 --endpoint-url=http://localhost:4566; Start-Sleep -Seconds 5; npm run start
```


### Command to stop docker container
```sh
docker stop $(docker ps -q -f ancestor=localstack/localstack)
```