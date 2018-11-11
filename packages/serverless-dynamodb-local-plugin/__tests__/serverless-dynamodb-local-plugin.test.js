/* @flow */
import {
 start, registerTables, setupTable, stop,
} from '@gopato/serverless-dynamodb-local-utils'

import GoPatoDynamoDBLocalPlugin from '../src/serverless-dynamodb-local-plugin'
import serverlessConfig from '../__fixtures__/serverless-config'
import tablesMock from '../../serverless-dynamodb-local-utils/__fixtures__/tables'

jest.mock('@gopato/serverless-dynamodb-local-utils', () => ({
  start: jest.fn(),
  registerTables: jest.fn(),
  setupTable: jest.fn(),
  stop: jest.fn(),
}))

function expectError(config, expectedError) {
  const plugin = new GoPatoDynamoDBLocalPlugin(config, {})
  expect(() => plugin.validateDynamoDBConfig()).toThrow(expectedError)
}

it('should throw errow when serverless config is invalid', () => {
  expectError(
    {
      service: {
        custom: {},
      },
    },
    'dynamodb config not found on serverless.custom',
  )

  expectError(
    {
      service: {
        custom: {
          dynamodb: {},
        },
      },
    },
    'serverless.resources not found',
  )

  expectError(
    {
      service: {
        custom: {
          dynamodb: {},
        },
        resources: {},
      },
    },
    'serverless.resources.Resources not found',
  )

  expectError(
    {
      service: {
        custom: {
          dynamodb: {},
        },
        resources: {
          Resources: {},
        },
      },
    },
    'could not find any AWS::DynamoDB::Table on serverless.resources.Resources',
  )
})

it('should not throw errow when serverless config is valid', () => {
  const plugin = new GoPatoDynamoDBLocalPlugin(serverlessConfig, {})
  expect(() => plugin.validateDynamoDBConfig()).not.toThrow()
})

it('should get dynamodb tables', () => {
  const plugin = new GoPatoDynamoDBLocalPlugin(serverlessConfig, {})
  expect(plugin.dynamodbTables).toEqual(tablesMock)
})

it('should set IS_OFFLINE on setOfflineEnvironmentHandler', async () => {
  delete process.env.IS_OFFLINE
  const plugin = new GoPatoDynamoDBLocalPlugin(serverlessConfig, {})
  await plugin.setOfflineEnvironmentHandler()
  expect(process.env.IS_OFFLINE).toBeTruthy()
})

it('should start dynamodb on startHandler', async () => {
  const plugin = new GoPatoDynamoDBLocalPlugin(serverlessConfig, {})
  await plugin.startHandler()
  expect(start).toHaveBeenCalled()
})

it('should register tables on startHandler', async () => {
  const plugin = new GoPatoDynamoDBLocalPlugin(serverlessConfig, {})
  await plugin.startHandler()
  expect(registerTables).toHaveBeenCalledWith(plugin.dynamodbTables)
})

it('should not migrate tables on migrateHandler if migrate option is false', async () => {
  const plugin = new GoPatoDynamoDBLocalPlugin(serverlessConfig, { migrate: false })
  await plugin.startHandler()
  await plugin.migrateHandler()

  plugin.dynamodbTables.forEach((table) => {
    expect(setupTable).not.toHaveBeenCalledWith(table.config.TableName, true)
  })
})

it('should migrate tables on migrateHandler', async () => {
  const plugin = new GoPatoDynamoDBLocalPlugin(serverlessConfig, { migrate: true })
  await plugin.startHandler()
  await plugin.migrateHandler()

  plugin.dynamodbTables.forEach((table) => {
    expect(setupTable).toHaveBeenCalledWith(table.config.TableName, true)
  })
})

it('should stop dynamodb on stopHandler', async () => {
  const plugin = new GoPatoDynamoDBLocalPlugin(serverlessConfig, {})
  await plugin.stopHandler()
  expect(stop).toHaveBeenCalled()
})
