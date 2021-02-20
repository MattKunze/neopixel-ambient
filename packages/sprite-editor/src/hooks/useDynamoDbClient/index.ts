import AWS from "aws-sdk"
import { useEffect, useRef } from "react"

export default function useDynamoDbClient() {
  const db = useRef<AWS.DynamoDB.DocumentClient>()
  useEffect(() => {
    db.current = new AWS.DynamoDB.DocumentClient({
      endpoint: "http://brie.boing.net:4566",
      region: "us-west-2",
      accessKeyId: "test",
      secretAccessKey: "test",
    })
  }, [])
  return db
}
