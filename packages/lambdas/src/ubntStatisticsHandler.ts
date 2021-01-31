import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda"
import WebSocket from "ws"

import config from "./config"
import { createResponse } from "./utils"

type UbntStatistics = Record<string, unknown>

const sendSocketMsg = (
  socket: WebSocket,
  msg: Record<string, unknown>
): void => {
  const formatted = JSON.stringify(msg)
  socket.send(`${formatted.length}\n${formatted}`)
}

const parseMsg = (data: WebSocket.Data): UbntStatistics | undefined => {
  try {
    const msg = typeof data === "string" ? data : data.toString("utf8")
    return JSON.parse(msg.substring(msg.indexOf("\n") + 1))
  } catch (e) {
    console.error({ e, data })
  }
}

const getParam = (event: APIGatewayEvent, key: string): string | undefined =>
  event.body ? JSON.parse(event.body)[key] : event.queryStringParameters?.[key]

export default async function handler(
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> {
  console.info({ event })
  const sessionId = getParam(event, "sessionId")
  if (!sessionId) {
    throw new Error("UBNT sessionId not provided - " + JSON.stringify(event))
  }

  const topics = getParam(event, "topics")?.split(/\s*,\s*/) || ["interfaces"]

  return new Promise((resolve, reject) => {
    const socket = new WebSocket(config.ubntSocket)

    socket.onopen = () => {
      sendSocketMsg(socket, {
        SESSION_ID: sessionId,
        SUBSCRIBE: topics.map((name) => ({ name })),
        UNSUBSCRIBE: [],
      })
    }

    const response: UbntStatistics = {}
    socket.onmessage = (ev) => {
      const parsed = parseMsg(ev.data)
      Object.assign(response, parsed)

      if (topics.every((key) => !!response[key])) {
        socket.close()
        resolve(
          createResponse({
            payload: response,
            ...(event.body ? JSON.parse(event.body) : null),
          })
        )
      }
    }
  })
}
