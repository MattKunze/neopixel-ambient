import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda"
import AWS from "aws-sdk"

import config from "./config"
import {
  createGatewayResponse,
  createUbntStatsListener,
  getUbntSessionId,
  LambdaEvent,
  normalizeEvent,
} from "./utils"

const lambda = new AWS.Lambda({
  endpoint: config.awsEndpoint,
})

interface StreamEvent {
  bucketArn: string
  topic?: string
  timeout?: number
}
export default async function handler(
  event: LambdaEvent,
  _context: Context
): Promise<APIGatewayProxyResult> {
  const {
    bucketArn,
    topic = "interfaces",
    timeout = 60,
  } = normalizeEvent<StreamEvent>(event)

  const sessionId = await getUbntSessionId()
  console.info({ bucketArn, topic, timeout, sessionId })

  const expires = Date.now() + timeout * 1000
  return new Promise((resolve) => {
    let count = 0
    createUbntStatsListener(sessionId, [topic], async (stats) => {
      const remaining = expires - Date.now()
      if (stats) {
        count++

        const payload = {
          key: `ubnt-${topic}`,
          payload: stats,
        }
        await lambda
          .invoke({
            FunctionName: bucketArn,
            InvocationType: "Event",
            Payload: JSON.stringify(payload),
          })
          .promise()
      }

      if (remaining > 0) {
        return true
      } else {
        resolve(createGatewayResponse({ count }))
        return false
      }
    })
  })
}
