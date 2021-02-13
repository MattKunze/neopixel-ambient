import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda"

import { createGatewayResponse } from "./utils"

export default async function handler(
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  console.info("echo", event)
  return createGatewayResponse({ event, context, env: process.env })
}
