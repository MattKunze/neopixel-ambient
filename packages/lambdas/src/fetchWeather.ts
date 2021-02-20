import { Context, APIGatewayProxyResult } from "aws-lambda"
import AWS from "aws-sdk"
import axios from "axios"

import config from "./config"
import { createGatewayResponse, LambdaEvent, normalizeEvent } from "./utils"

const lambda = new AWS.Lambda({
  endpoint: config.awsEndpoint,
})

interface FetchOptions {
  bucketArn: string
  zipCode: string
}

interface WeatherResponse {
  coord: {
    lat: number
    lon: number
  }
}

export default async function handler(
  event: LambdaEvent,
  _context: Context
): Promise<APIGatewayProxyResult> {
  const { bucketArn, zipCode } = normalizeEvent<FetchOptions>(event)
  console.info("weather", { bucketArn, zipCode })

  const {
    data: { coord },
  } = await axios.get<WeatherResponse>(
    `https://api.openweathermap.org/data/2.5/weather?${new URLSearchParams({
      zip: zipCode,
      appid: config.openWeatherApiKey,
    }).toString()}`
  )

  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?${new URLSearchParams({
      lat: String(coord.lat),
      lon: String(coord.lon),
      units: "imperial",
      appid: config.openWeatherApiKey,
    }).toString()}`
  )

  const payload = {
    key: `weather-${zipCode}`,
    payload: data,
  }
  await lambda
    .invoke({
      FunctionName: bucketArn,
      InvocationType: "Event",
      Payload: JSON.stringify(payload),
    })
    .promise()

  return createGatewayResponse(data)
}
