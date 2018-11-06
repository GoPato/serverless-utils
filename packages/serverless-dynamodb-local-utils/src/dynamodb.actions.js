/* @flow */
import path from 'path'
import fs from 'fs'
import dynamodbLocal from 'dynamodb-local'

export async function start() {
  const env = process.env.NODE_ENV
  const test = env === 'test'
  const dbPath = path.resolve(process.cwd(), '.db')
  const arg = test ? null : dbPath
  const createDir = !test && !fs.existsSync(dbPath)

  if (createDir) {
    fs.mkdirSync(dbPath)
  }

  dynamodbLocal.configureInstaller({ installPath: path.resolve(process.cwd(), '.dynamodb') })
  await dynamodbLocal.launch(8000, arg)
}

export async function stop() {
  await dynamodbLocal.stop(8000)
}
