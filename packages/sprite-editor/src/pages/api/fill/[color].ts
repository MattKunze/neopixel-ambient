import * as MQTT from "async-mqtt"
import type { NextApiRequest, NextApiResponse } from "next"

const MQTT_HOST = "mqtt://mqtt:1883"
const MQTT_TOPIC = "sprite"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { query } = req
  const color = Array.isArray(query.color) ? query.color[0] : query.color

  const client = MQTT.connect(MQTT_HOST)
  await client.publish(`${MQTT_TOPIC}/fill`, color)
  client.end()

  res.end("ok")
}
