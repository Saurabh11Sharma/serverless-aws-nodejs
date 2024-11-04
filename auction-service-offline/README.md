# 🏷️ Auction Service

## ✍️ Author

**Name:** Saurabh Sharma

## 📜 Project Description

The **Auction Service** is a serverless application built using AWS Lambda and DynamoDB. It allows users to create and manage auctions. The service includes endpoints to create auctions, place bids, and retrieve auction details. It leverages the **Serverless Framework** for deployment and integration with local development tools such as **DynamoDB Local**.

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
  "amount": 0,
  "status": "OPEN",
  "createdAt": "2023-09-01T12:34:56.789Z",
  "endingAt": "2023-09-01T13:34:56.789Z"
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
    "amount": 100,
    "status": "OPEN",
    "createdAt": "2023-09-01T12:34:56.789Z",
    "endingAt": "2023-09-01T13:34:56.789Z"
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
  "amount": 100,
  "status": "OPEN",
  "createdAt": "2023-09-01T12:34:56.789Z",
  "endingAt": "2023-09-01T13:34:56.789Z"
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
  "amount": 150,
  "status": "OPEN",
  "createdAt": "2023-09-01T12:34:56.789Z",
  "endingAt": "2023-09-01T13:34:56.789Z"
}
```

## 🚀 Running the Code Locally

To run the Auction Service locally, follow these steps:

### 💻 Prerequisites

- **Node.js** (>= 16.x)
- **Serverless Framework** (`npm install -g serverless`)
- **AWS CLI**
- **Docker** (for running the DynamoDB local image)

### Step 1: Start the DynamoDB Local Container

Run the following Docker command to start the DynamoDB local container:

```sh
docker run --name dynamodb-local -p 8000:8000 amazon/dynamodb-local
```

To create the DynamoDB Table, run the following command in another terminal:

```sh
aws dynamodb create-table --table-name AuctionsTable --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 --endpoint-url http://localhost:8000
```

### Step 2: Start the Application

```sh
npm run start
```

### Step 3: Check Table Created

To check the DynamoDB Tables:

```sh
aws dynamodb list-tables --endpoint-url=http://localhost:8000
```

### Insert Data

Run the `generateItems.js` script:

```sh
node generateItems.js
```

### Scan the DynamoDB Table

To scan the DynamoDB Table and list all items:

```sh
aws dynamodb scan --table-name AuctionsTable --endpoint-url http://localhost:8000
```

### Command to Stop Docker Container

To stop the running DynamoDB local container:

```sh
docker stop dynamodb-local
docker rm dynamodb-local
```

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