import { Context, APIGatewayProxyResult } from "aws-lambda"
import AWS from "aws-sdk"
import * as R from "ramda"

import config from "./config"
import { createGatewayResponse, LambdaEvent, normalizeEvent } from "./utils"

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  endpoint: config.awsEndpoint,
})

interface DeleteRequest {
  key: string
  expires: number
}

const extractKey = R.pick(["key", "timestamp"])

export default async function handler(
  event: LambdaEvent,
  _context: Context
): Promise<APIGatewayProxyResult> {
  const { key, expires } = normalizeEvent<DeleteRequest>(event)

  const response = await dynamoDb
    .query({
      TableName: config.bucketTable,
      KeyConditionExpression: "#key = :key and #timestamp < :expires",
      ExpressionAttributeNames: {
        "#key": "key",
        "#timestamp": "timestamp",
      },
      ExpressionAttributeValues: {
        ":key": key,
        ":expires": Math.floor(Date.now() / 1000) - expires,
      },
    })
    .promise()

  if (!response.Items) {
    throw new Error("No response for some reason")
  }

  const requests = response.Items.map((item) =>
    dynamoDb
      .delete({
        TableName: config.bucketTable,
        Key: extractKey(item),
      })
      .promise()
  )
  const start = Date.now()
  await Promise.all(requests)

  return createGatewayResponse({
    count: response.Items.length,
    elapsed: Date.now() - start,
  })
}
