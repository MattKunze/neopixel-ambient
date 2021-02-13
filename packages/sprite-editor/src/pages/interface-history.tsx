import AWS from "aws-sdk"
import * as R from "ramda"
import { useEffect, useRef, useState } from "react"
import { useInterval } from "react-use"
import {
  VictoryArea,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryStack,
  VictoryTheme,
} from "victory"

import Toggle from "components/atoms/Toggle"
import PixelGrid from "components/molecules/PixelGrid"
// import useBroker from "hooks/useBroker"
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
  timestamp: number
  down: number
  up: number
  isSwitched: boolean
}
type FormattedStats = Record<string, FormattedStat>

const formatRawStat = (timestamp: number, raw: RawInterfaceStat) => ({
  timestamp,
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

const formatTimestamp = (timestamp: number) =>
  new Date(timestamp * 1000).getSeconds()

const formatBitrate = (bps: number) => {
  let suffix: string
  if (bps >= 1024 * 1024) {
    suffix = "m"
    bps /= 1024 * 1024
  } else if (bps >= 1024) {
    suffix = "k"
    bps /= 1024
  } else {
    suffix = "b"
  }
  return `${bps.toFixed(1)}${suffix}`
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

const fetchHistory = async (db: AWS.DynamoDB.DocumentClient) => {
  const response = await db
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
    return response.Items.reduce<Record<string, FormattedStat[]>>(
      (memo, item) => {
        const timestamp = item["timestamp"] as number
        const stats = item["interfaces"] as RawStats
        return Object.keys(stats).reduce<Record<string, FormattedStat[]>>(
          (memo, key) => {
            memo[key] = memo[key] ?? []
            memo[key].push(formatRawStat(timestamp, stats[key]))
            return memo
          },
          memo
        )
      },
      {}
    )
  } else {
    return null
  }
}

export default function InterfaceHistory() {
  const [active, setActive] = useState(true)
  const [history, setHistory] = useState<Record<
    string,
    FormattedStat[]
  > | null>(null)
  // const broker = useBroker()

  const db = useRef<AWS.DynamoDB.DocumentClient>()
  useEffect(() => {
    db.current = new AWS.DynamoDB.DocumentClient({
      endpoint: "http://localhost:4566",
      region: "us-west-2",
      accessKeyId: "test",
      secretAccessKey: "test",
    })
  }, [])

  useInterval(async () => {
    if (!db.current || !active) {
      return
    }
    const fetched = await fetchHistory(db.current)
    setHistory(fetched)
    console.info(fetched)
  }, 5000)

  if (!history) {
    return null
  }

  return (
    <>
      <div className="container mx-auto mt-4">
        <Toggle value={active} onClick={() => setActive(!active)} />
      </div>
      <div className="container mx-auto m-4 grid grid-flow-col gap-2">
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryAxis tickFormat={formatTimestamp} />
          <VictoryAxis dependentAxis={true} tickFormat={formatBitrate} />
          <VictoryStack colorScale="warm">
            <VictoryArea data={history.switch0} x="timestamp" y="up" />
            <VictoryArea data={history.switch0} x="timestamp" y="down" />
          </VictoryStack>
          <VictoryStack colorScale="blue" style={{ data: { opacity: 0.5 } }}>
            {Object.keys(history)
              .filter((key) => key.match(/eth[1-9]/))
              .map((key) => (
                <VictoryArea
                  key={key}
                  data={history[key]}
                  x="timestamp"
                  y="up"
                />
              ))}
          </VictoryStack>
        </VictoryChart>
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryAxis tickFormat={(t) => t} />
          <VictoryAxis dependentAxis={true} tickFormat={formatBitrate} />
          <VictoryStack colorScale="grayscale">
            <VictoryBar
              horizontal
              data={Object.keys(history)
                .filter((key) => key.startsWith("eth"))
                .map((key) => ({
                  key,
                  rate: history[key][0].up + history[key][0].down,
                }))}
              x="key"
              y="rate"
            />
          </VictoryStack>
        </VictoryChart>
      </div>
    </>
  )
}
