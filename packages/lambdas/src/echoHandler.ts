import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda"

import { createResponse } from "./utils"

export default async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.info("echo", event)
  return createResponse({ event, context, env: process.env })
}
