import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda"

import { createGatewayResponse, getUbntSessionId } from "./utils"

export default async function handler(
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> {
  const sessionId = await getUbntSessionId()
  return createGatewayResponse({
    sessionId,
    ...(event.body ? JSON.parse(event.body) : null),
  })
}
