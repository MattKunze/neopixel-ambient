import axios, { AxiosError } from "axios"
import { Context, APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda"
import cookie from "cookie"

import config from "./config"
import { createResponse } from "./utils"

export default async function handler(
  event: APIGatewayEvent,
  _context: Context
): Promise<APIGatewayProxyResult> {
  console.info({ event })
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
        return createResponse({
          sessionId: cookies["PHPSESSID"],
          ...(event.body ? JSON.parse(event.body) : null),
        })
      }
    }

    throw new Error("Unexpected error")
  }
}
