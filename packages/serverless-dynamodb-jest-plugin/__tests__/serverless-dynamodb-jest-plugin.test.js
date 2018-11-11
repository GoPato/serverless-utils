/* @flow */
import DynamodbJestPlugin from '../src/serverless-dynamodb-jest-plugin'

const plugin = new DynamodbJestPlugin(
  { service: { provider: { environment: {} } }, config: { servicePath: '.' } },
  {},
)

jest.mock('jest')

it('should assign test to NODE_ENV and set IS_OFFLINE', () => {
  process.env.NODE_ENV = undefined
  delete process.env.IS_OFFLINE

  plugin.testHandler()
  expect(process.env.NODE_ENV).toBe('test')
  expect(process.env.IS_OFFLINE).toBeTruthy()
})
