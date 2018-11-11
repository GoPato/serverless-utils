/* @flow */
/* eslint-disable no-console */
import { raw, doc } from '@gopato/serverless-dynamodb-client'
import { locateSeeds, writeSeeds } from 'serverless-dynamodb-local/src/seeder'

import { getTable } from './tables.registry'

export async function setupTable(tableName: ?string, shouldSeed: boolean = false) {
  if (!tableName) return
  const table = getTable(tableName)

  try {
    await raw.createTable(table.config).promise()

    if (!shouldSeed || !table.seeds) {
      return
    }

    const seeds = await locateSeeds(table.seeds)
    await writeSeeds(doc.batchWrite.bind(doc), tableName, seeds)
  } catch (e) {
    if (e.name === 'ResourceInUseException') {
      console.log(`Info: table ${tableName} already exists!`)
    } else {
      console.error(`${e.name}: ${e.message}`)
    }
  }
}

export async function teardownTable(tableName: ?string) {
  if (!tableName) return

  const table = getTable(tableName)
  await raw.deleteTable({ TableName: table.config.TableName }).promise()
}
