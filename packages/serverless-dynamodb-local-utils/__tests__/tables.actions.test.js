/* @flow */
/* eslint-disable global-require, import/no-dynamic-require */
import path from 'path'
import { raw, doc } from '@gopato/serverless-dynamodb-client'

import {
  start,
  stop,
  registerTables,
  setupTable,
  teardownTable,
} from '../src/serverless-dynamodb-local-utils'
import tables from '../__fixtures__/tables'

beforeAll(async () => {
  await registerTables(tables)
})

beforeEach(async () => {
  await start()
})

afterEach(async () => {
  await stop()
})

it('should create the requested table on setup', async () => {
  await Promise.all(
    tables.map(async ({ config }) => {
      await setupTable(config.TableName)
      const { Table } = await raw.describeTable({ TableName: config.TableName }).promise()
      expect(Table).toMatchObject(config)
      await teardownTable(config.TableName)
    }),
  )
})

it('should seed the requested table on setup', async () => {
  await Promise.all(
    tables.map(async ({ config, seeds }) => {
      await setupTable(config.TableName, true)
      const { Items } = await doc.scan({ TableName: config.TableName }).promise()
      const seedsValues = seeds
        // $FlowFixMe
        .map(seedPath => require(path.resolve(process.cwd(), seedPath)))
        .reduce((acc, curr) => [...acc, ...curr], [])

      expect(Items).toEqual(expect.arrayContaining(seedsValues))
      await teardownTable(config.TableName)
    }),
  )
})

it('should delete the requested table on teardown', async () => {
  await Promise.all(
    tables.map(async ({ config }) => {
      await setupTable(config.TableName)
      await teardownTable(config.TableName)
      const { TableNames } = await raw.listTables().promise()
      expect(TableNames).not.toContain(config.TableName)
    }),
  )
})
