/* @flow */
import path from 'path'
import dynamodbLocal from 'dynamodb-local'

import { start, stop } from '../src/serverless-dynamodb-local-utils'

jest.mock('dynamodb-local', () => ({
  configureInstaller: jest.fn(),
  launch: jest.fn(),
  stop: jest.fn(),
}))

it('should configure dynamodb on start', async () => {
  await start()
  expect(dynamodbLocal.configureInstaller).toHaveBeenCalledWith({
    installPath: path.join(process.cwd(), '.dynamodb'),
  })
})

it('should start dynamodb inMemory on test environment', async () => {
  process.env.NODE_ENV = 'test'
  await start()
  expect(dynamodbLocal.launch).toHaveBeenCalledWith(8000, null)
})

it('should start dynamodb with dbPath when is not on test environment', async () => {
  process.env.NODE_ENV = 'development'
  await start()
  expect(dynamodbLocal.launch).toHaveBeenCalledWith(8000, path.resolve(process.cwd(), '.db'))
  process.env.NODE_ENV = 'test'
})

it('should stop dynamodb', async () => {
  await stop()
  expect(dynamodbLocal.stop).toHaveBeenCalledWith(8000)
})
