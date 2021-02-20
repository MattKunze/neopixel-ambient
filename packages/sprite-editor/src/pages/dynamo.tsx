import * as R from "ramda"
import { useState } from "react"

import PixelGrid from "components/molecules/PixelGrid"
import useAsyncEffect from "hooks/useAsyncEffect"
import useDynamoDbClient from "hooks/useDynamoDbClient"
import { EMPTY_SPRITE, Sprite } from "types"

interface RawInterfaceStat {
  addresses?: string[]
  l1up: "true" | "false"
  is_switched_port?: "true" | "false"
  stats: {
    rx_bps: string
    tx_bps: string
  }
}
type RawStats = Record<string, RawInterfaceStat>

interface FormattedStat {
  down: number
  up: number
  isSwitched: boolean
}
type FormattedStats = Record<string, FormattedStat>

const formatRawStat = (raw: RawInterfaceStat) => ({
  down: parseInt(raw.stats.rx_bps, 10),
  up: parseInt(raw.stats.tx_bps, 10),
  isSwitched: raw.is_switched_port === "true",
})

const RANGES = [
  100 * 1024, // 100Kbs
  500 * 1024, // 500Kbs
  1024 * 1024, // 1Mbs
  5 * 1024 * 1024, // 5Mbs
  10 * 1024 * 1024, // 10Mbs
  100 * 1024 * 1024, // 100Mbs
  500 * 1024 * 1024, // 500Mbs
  1024 * 1024 * 1024, // 1Gbps
]
const INTERFACE_COUNT = 8
const UP_COLOR = "#0f0"
const DOWN_COLOR = "#00f"

const getRange = (stats: FormattedStat[]) => {
  const max = R.reduce<FormattedStat, FormattedStat>(
    R.maxBy<FormattedStat>((s) => s.up + s.down),
    stats[0],
    stats.slice(1)
  )
  return RANGES.find((t) => max.up <= t && max.down <= t) || RANGES[0]
}

const currentSprite = (stats: FormattedStats) => {
  const switchedStats = R.pipe<FormattedStats, FormattedStats, FormattedStat[]>(
    R.pickBy<FormattedStats>((s, key) => s.isSwitched && key !== "eth9"),
    R.values
  )(stats)
  const range = getRange(switchedStats)
  const sprite = EMPTY_SPRITE.slice()
  for (let i = 0; i < INTERFACE_COUNT; i++) {
    const stat = switchedStats[i]
    const up = Math.floor((stat.up / range) * INTERFACE_COUNT)
    const down = Math.floor((stat.down / range) * INTERFACE_COUNT)
    const [largeColor, smallColor] =
      up > down ? [UP_COLOR, DOWN_COLOR] : [DOWN_COLOR, UP_COLOR]
    for (let l = 0; l < Math.max(up, down); l++) {
      sprite[i * INTERFACE_COUNT + l] = largeColor
    }
    for (let s = 0; s < Math.min(up, down); s++) {
      sprite[i * INTERFACE_COUNT + s] = smallColor
    }
  }

  return sprite
}

const historySprite = (
  stats: FormattedStats[],
  interfaceName: string = "switch0"
) => {
  const sprite = EMPTY_SPRITE.slice()
  const history = R.map<FormattedStats, FormattedStat>(
    (s) => s[interfaceName],
    stats.slice(0, INTERFACE_COUNT).reverse()
  )
  const range = getRange(history)
  for (let i = 0; i < Math.min(history.length, INTERFACE_COUNT); i++) {
    const stat = history[i]
    const up = Math.floor((stat.up / range) * INTERFACE_COUNT)
    const down = Math.floor((stat.down / range) * INTERFACE_COUNT)
    const [largeColor, smallColor] =
      up > down ? [UP_COLOR, DOWN_COLOR] : [DOWN_COLOR, UP_COLOR]
    for (let l = 0; l < Math.max(up, down); l++) {
      sprite[i * INTERFACE_COUNT + l] = largeColor
    }
    for (let s = 0; s < Math.min(up, down); s++) {
      sprite[i * INTERFACE_COUNT + s] = smallColor
    }
  }
  return sprite
}

export default function Dynamo() {
  const [current, setCurrent] = useState<Sprite | null>(null)
  const [history, setHistory] = useState<Sprite | null>(null)

  const db = useDynamoDbClient()

  useAsyncEffect(async () => {
    if (!db.current) {
      return
    }
    const response = await db.current
      .query({
        TableName: "bucket",
        KeyConditions: {
          key: {
            ComparisonOperator: "EQ",
            AttributeValueList: ["ubnt-interfaces"],
          },
        },
        ScanIndexForward: false,
        ConsistentRead: false,
        Limit: 10,
        ReturnConsumedCapacity: "TOTAL",
      })
      .promise()
    if (response.Items) {
      const interfaces = response.Items.map(
        (item) => item["interfaces"] as RawStats
      )
      const formatted = interfaces.map((item) =>
        Object.keys(item).reduce<FormattedStats>((memo, key) => {
          memo[key] = formatRawStat(item[key])
          return memo
        }, {})
      )

      setCurrent(currentSprite(formatted[0]))
      setHistory(historySprite(formatted))
    }
  }, [db.current])

  useAsyncEffect(async () => {
    if (!db.current) {
      return
    }

    const expires = Math.floor(Date.now() / 1000) - 300
    const response = await db.current
      .query({
        TableName: "bucket",
        KeyConditionExpression: "#key = :key and #timestamp < :expires",
        ExpressionAttributeNames: {
          "#key": "key",
          "#timestamp": "timestamp",
        },
        ExpressionAttributeValues: {
          ":key": "ubnt-interfaces",
          ":expires": expires,
        },
      })
      .promise()
    if (response.Items) {
      console.info("stale", response.Items)
    }
  }, [db.current])

  return (
    <div className="container mx-auto m-4 grid grid-flow-row gap-8">
      {current && <PixelGrid sprite={current} editable={false} />}
      {history && <PixelGrid sprite={history} editable={false} />}
    </div>
  )
}
