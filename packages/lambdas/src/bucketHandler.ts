import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda"
import AWS from "aws-sdk"

import config from "./config"
import { createResponse } from "./utils"

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  endpoint: config.awsEndpoint,
})

export default async function handler(
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> {
  const body = JSON.parse(event.body || "")
  const { key } = body
  console.info("bucket", body)

  const item = {
    key,
    timestamp: Date.now(),
    ...body.payload,
  }
  await dynamoDb
    .put({
      TableName: config.bucketTable,
      Item: item,
    })
    .promise()

  return createResponse(item)
}
