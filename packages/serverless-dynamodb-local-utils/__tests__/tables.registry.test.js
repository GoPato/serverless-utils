/* @flow */
/* eslint-disable global-require */
import { registerTables, getTables, getTable } from '../src/serverless-dynamodb-local-utils'
import tables from '../__fixtures__/tables'

beforeEach(() => {
  process.env.DYNAMODB_TABLES = JSON.stringify([])
})

it('should throw error when registerTables parameter is invalid', async () => {
  async function expectError(tablesConfig, error) {
    await expect(registerTables(tablesConfig)).rejects.toThrowError(error)
  }

  await expectError()
  await expectError([])
  await expectError([{}])

  await expectError([
    {
      config: {},
    },
  ])

  await expectError([
    {
      config: {
        TableName: null,
      },
    },
  ])

  await expectError([
    {
      config: {
        TableName: 'Table',
        AttributeDefinitions: null,
      },
    },
  ])

  await expectError([
    {
      config: {
        TableName: 'Table',
        AttributeDefinitions: [{ AttributeName: null }],
      },
    },
  ])

  await expectError([
    {
      config: {
        TableName: 'Table',
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: null }],
      },
    },
  ])

  await expectError([
    {
      config: {
        TableName: 'Table',
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: null,
      },
    },
  ])

  await expectError([
    {
      config: {
        TableName: 'Table',
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: null }],
      },
    },
  ])

  await expectError([
    {
      config: {
        TableName: 'Table',
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'id', KeyType: null }],
      },
    },
  ])

  await expectError([
    {
      config: {
        TableName: 'Table',
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        ProvisionedThroughput: null,
      },
    },
  ])

  await expectError([
    {
      config: {
        TableName: 'Table',
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        ProvisionedThroughput: {
          ReadCapacityUnits: null,
        },
      },
    },
  ])

  await expectError([
    {
      config: {
        TableName: 'Table',
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: null,
        },
      },
    },
  ])

  await expectError([
    {
      config: {
        TableName: 'Table',
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
      seeds: null,
    },
  ])

  await expectError([
    {
      config: {
        TableName: 'Table',
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
      seeds: [null, null, null],
    },
  ])
})

it('should not throw error when registerTables parameter is valid', async () => {
  await expect(registerTables(tables)).resolves.toBeUndefined()
})

it('should throw error when getTables has been called without registerTables', () => {
  expect(() => getTables()).toThrowError('you should call registerTables() before getTables()')
})

it('should return registered tables on getTables', async () => {
  await registerTables(tables)
  expect(getTables()).toEqual(tables)
})

it('should throw error when getTable has been called with an invalid tableName', async () => {
  await registerTables(tables)
  // $FlowExpectedError: argument required
  expect(() => getTable()).toThrow('tableName must be a string')
  // $FlowExpectedError: argument must be string
  expect(() => getTable(1)).toThrow('tableName must be a string')
})

it('should throw error when getTable has been called with an inexisting tableName', async () => {
  await registerTables(tables)
  expect(() => getTable('inexisting-table-name')).toThrow(
    `'inexisting-table-name' table not found. Try with: ${tables
      .map(t => `'${t.config.TableName}'`)
      .join('|')}`,
  )
})

it('should return the requested table on getTable(name)', async () => {
  await registerTables(tables)
  expect(getTable(tables[0].config.TableName)).toEqual(tables[0])
  expect(getTable(tables[1].config.TableName)).toEqual(tables[1])
})
