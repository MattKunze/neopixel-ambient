interface Config {
  awsEndpoint: string
  ubntUrl: string
  ubntUsername: string
  ubntPassword: string
  ubntSocket: string
  bucketTable: string
}

const getVar = (key: string) => {
  if (!process.env[key]) {
    throw new Error(`${key} not defined in environment`)
  }
  return process.env[key] as string
}

const config: Config = {
  awsEndpoint: `http://${
    // todo - this _should_work I think, but doesn't seem to
    //process.env.LOCALSTACK_HOSTNAME
    "host.docker.internal"
  }:${process.env.EDGE_PORT}`,
  ubntUrl: getVar("UBNT_URL"),
  ubntUsername: getVar("UBNT_USERNAME"),
  ubntPassword: getVar("UBNT_PASSWORD"),
  ubntSocket: getVar("UBNT_SOCKET"),
  bucketTable: getVar("BUCKET_TABLE"),
}

export default config
