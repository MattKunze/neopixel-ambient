const MQTT = require("async-mqtt")
const AWS = require("aws-sdk")

const MQTT_HOST = "ws://mqtt.boing.net:9001"
const MQTT_TOPIC = "bucket/#"
const SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:000000000000:bucket"

const sns = new AWS.SNS({
  apiVersion: "2010-03-31",
  endpoint: "http://brie.boing.net:4566",
  region: "us-west-2",
  accessKeyId: "test",
  secretAccessKey: "test",
})

const client = MQTT.connect(MQTT_HOST)
client.subscribe(MQTT_TOPIC)

const decoder = new TextDecoder("utf-8")
client.on("message", async (topic, payload) => {
  console.info({ topic, payload: decoder.decode(payload) })
  const result = await sns
    .publish({
      TopicArn: SNS_TOPIC_ARN,
      Subject: topic.replace("bucket/", ""),
      Message: decoder.decode(payload),
    })
    .promise()
  console.info({ result })
})
