/* @flow */
import AWS from 'aws-sdk'

function isOffline() {
  return process.env.IS_OFFLINE
}

const options = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
}

if (isOffline()) {
  AWS.config.update({
    accessKeyId: 'localAccessKey',
    secretAccessKey: 'localSecretAccessKey',
    region: 'localRegion',
  })
}

export const raw = isOffline() ? new AWS.DynamoDB(options) : new AWS.DynamoDB()
export const doc = isOffline()
  ? new AWS.DynamoDB.DocumentClient(options)
  : new AWS.DynamoDB.DocumentClient()
