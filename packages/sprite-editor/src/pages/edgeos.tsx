import axios from "axios"
import { useEffect, useRef, useState } from "react"

const post = (msg: object, socket: WebSocket): void => {
  const formatted = JSON.stringify(msg)
  console.info(`${formatted.length}\n${formatted}`)
  socket.send(`${formatted.length}\n${formatted}`)
}

const parse = (msg: string) => {
  try {
    const data = JSON.parse(msg.substring(msg.indexOf("\n") + 1))
    console.info(data)
  } catch (e) {
    console.error({ e, msg })
  }
}

export default function EdgeOs() {
  const [connected, setConnected] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const socket = useRef<WebSocket | null>(null)

  useEffect(() => {
    ;(async () => {
      const { data } = await axios.get("./api/uisp")
      setSessionId(data.sessionId)
    })()
  }, [])

  useEffect(() => {
    if (sessionId) {
      socket.current = new WebSocket("wss://ubnt.boing.net/ws/stats")
      socket.current.onopen = (ev) => setConnected(true)
      socket.current.onmessage = (ev) => parse(ev.data)
    }
  }, [sessionId])

  useEffect(() => {
    if (connected && socket.current) {
      const msg = {
        SESSION_ID: sessionId,
        SUBSCRIBE: [{ name: "system-stats" }, { name: "interfaces" }],
        UNSUBSCRIBE: [],
      }
      post(msg, socket.current)
    }
  }, [connected])

  return <div>SessionId: {sessionId}</div>
}
