import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda"

import { createGatewayResponse, createUbntStatsListener } from "./utils"

type UbntStatistics = Record<string, unknown>

const DEFAULT_TOPICS = ["interfaces"]
const getParam = (event: APIGatewayEvent, key: string): string | undefined =>
  event.body ? JSON.parse(event.body)[key] : event.queryStringParameters?.[key]

export default async function handler(
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> {
  const sessionId = getParam(event, "sessionId")
  if (!sessionId) {
    throw new Error("UBNT sessionId not provided - " + JSON.stringify(event))
  }

  const topics = getParam(event, "topics")?.split(/\s*,\s*/) || DEFAULT_TOPICS

  return new Promise((resolve) => {
    const response: UbntStatistics = {}
    createUbntStatsListener(sessionId, topics, (stats) => {
      Object.assign(response, stats)

      if (topics.every((key) => !!response[key])) {
        resolve(
          createGatewayResponse({
            payload: response,
            ...(event.body ? JSON.parse(event.body) : null),
          })
        )
        return false
      } else {
        return true
      }
    })
  })
}
