import { APIGatewayEvent } from "aws-lambda"
import axios, { AxiosError } from "axios"
import cookie from "cookie"
import WebSocket from "ws"

import config from "./config"

export type LambdaEvent = APIGatewayEvent | Record<string, unknown>

export const normalizeEvent = <T>(event: LambdaEvent): T => {
  if ("body" in event) {
    return JSON.parse((event as APIGatewayEvent).body || "") as T
  } else {
    return event as T
  }
}

export const getUbntSessionId = async (): Promise<string> => {
  const params = new URLSearchParams({
    username: config.ubntUsername,
    password: config.ubntPassword,
  })
  try {
    await axios.post(config.ubntUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Type": "application/json",
      },
      withCredentials: true,
      maxRedirects: 0,
    })
    throw new Error("Unexpected response")
  } catch (e) {
    const axiosError = e as AxiosError
    if (axiosError.response?.status === 303) {
      const { headers } = axiosError.response
      const cookies = cookie.parse(headers["set-cookie"].join("; "))
      if ("PHPSESSID" in cookies) {
        return cookies["PHPSESSID"]
      }
    }

    throw new Error("Unexpected error")
  }
}

const sendSocketMsg = (
  socket: WebSocket,
  msg: Record<string, unknown>
): void => {
  const formatted = JSON.stringify(msg)
  socket.send(`${formatted.length}\n${formatted}`)
}

const parseSocketMsg = (
  data: WebSocket.Data
): Record<string, unknown> | undefined => {
  try {
    const msg = typeof data === "string" ? data : data.toString("utf8")
    return JSON.parse(msg.substring(msg.indexOf("\n") + 1))
  } catch {
    console.error("Message parse exception")
  }
}

export const createUbntStatsListener = (
  sessionId: string,
  topics: string[],
  onStats: (
    stats: Record<string, unknown> | undefined
  ) => boolean | Promise<boolean>
) => {
  const socket = new WebSocket(config.ubntSocket)

  socket.onopen = () => {
    sendSocketMsg(socket, {
      SESSION_ID: sessionId,
      SUBSCRIBE: topics.map((name) => ({ name })),
      UNSUBSCRIBE: [],
    })
  }

  socket.onmessage = async (ev) => {
    const parsed = parseSocketMsg(ev.data)
    if (!(await onStats(parsed))) {
      socket.close()
    }
  }
}

export const createGatewayResponse = (
  body: string | Record<string, unknown>
) => ({
  statusCode: 200,
  headers: {
    "Content-Type": "application/json",
  },
  body: typeof body === "string" ? body : JSON.stringify(body),
})
