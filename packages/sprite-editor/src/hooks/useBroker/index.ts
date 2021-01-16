import MQTT from "async-mqtt"
import { useCallback, useEffect, useRef } from "react"

import { Sprite } from "types"

const MQTT_HOST = "ws://mqtt:9001"
const MQTT_TOPIC = "sprite"

interface BrokerInterface {
  off: () => void
  fill: (color: string) => void
  sprite: (data: Sprite) => void
}

export default function useBroker(): BrokerInterface {
  const client = useRef<MQTT.AsyncMqttClient | null>(null)

  useEffect(() => {
    client.current = MQTT.connect(MQTT_HOST)
  })

  const off = useCallback(() => {
    console.info("off")
    client.current?.publish(`${MQTT_TOPIC}/off`, "")
  }, [client.current])
  const fill = useCallback(
    (color: string) => {
      console.info("fill", color)
      client.current?.publish(`${MQTT_TOPIC}/fill`, color)
    },
    [client.current]
  )
  const sprite = useCallback(
    (data: Sprite) => {
      console.info("sprite", data)
      client.current?.publish(`${MQTT_TOPIC}/sprite`, data.join(","))
    },
    [client.current]
  )

  return { off, fill, sprite }
}
