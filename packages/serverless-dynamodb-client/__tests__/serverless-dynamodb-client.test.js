/* @flow */
/* eslint-disable global-require */
const options = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
}

const testWithEnvironment = (env, shouldMatch = true) => {
  process.env.NODE_ENV = env
  const { raw, doc } = require('../src/serverless-dynamodb-client')

  if (shouldMatch) {
    expect(raw.config).toMatchObject(options)
    expect(doc.options).toMatchObject(options)
  } else {
    expect(raw.config).not.toMatchObject(options)
    expect(doc.options).not.toMatchObject(options)
  }

  process.env.NODE_ENV = undefined
}

beforeEach(() => {
  jest.resetModules()
})

it('should attach local endpoints when NODE_ENV is development', () => {
  testWithEnvironment('development')
})

it('should attach local endpoints when NODE_ENV is test', () => {
  testWithEnvironment('test')
})

it('should not attach local endpoints when NODE_ENV is different', () => {
  testWithEnvironment('other', false)
})
