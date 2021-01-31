import { parse } from "@babel/core"
import axios, { AxiosError } from "axios"
import cookie from "cookie"
import type { NextApiRequest, NextApiResponse } from "next"

const getSessionId = async (): Promise<string> => {
  const params = new URLSearchParams({ username: "ubnt", password: "d0Nk1Ng" })
  try {
    await axios.post("https://ubnt.boing.net", params, {
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const sessionId = await getSessionId()
  res.send({ sessionId })
}
