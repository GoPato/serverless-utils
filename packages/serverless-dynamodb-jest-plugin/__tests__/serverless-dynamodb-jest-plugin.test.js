/* @flow */
import DynamodbJestPlugin from '../src/serverless-dynamodb-jest-plugin'

const plugin = new DynamodbJestPlugin(
  { service: { provider: { environment: {} } }, config: { servicePath: '.' } },
  {},
)

jest.mock('jest')

it('should assign test to NODE_ENV', () => {
  process.env.NODE_ENV = undefined
  plugin.testHandler()
  expect(process.env.NODE_ENV).toBe('test')
})
