import { Context, APIGatewayProxyResult } from "aws-lambda"
import AWS from "aws-sdk"

import config from "./config"
import { createGatewayResponse, LambdaEvent, normalizeEvent } from "./utils"

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  endpoint: config.awsEndpoint,
})

interface BucketEntry {
  key: string
  payload: Record<string, any>
}

export default async function handler(
  event: LambdaEvent,
  _context: Context
): Promise<APIGatewayProxyResult> {
  const { key, payload } = normalizeEvent<BucketEntry>(event)
  const timestamp = Math.round(Date.now() / 1000)
  console.info("bucket", { key, timestamp })

  const item = {
    key,
    timestamp,
    payload,
  }
  await dynamoDb
    .put({
      TableName: config.bucketTable,
      Item: item,
    })
    .promise()

  return createGatewayResponse(item)
}
