/* @flow */
/* eslint-disable global-require */
const options = {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
}

const testWithOffline = (isOffline = true, shouldMatch = true) => {
  if (isOffline) {
    process.env.IS_OFFLINE = 'true'
  } else {
    delete process.env.IS_OFFLINE
  }

  const { raw, doc } = require('../src/serverless-dynamodb-client')

  if (shouldMatch) {
    expect(raw.config).toMatchObject(options)
    expect(doc.options).toMatchObject(options)
  } else {
    expect(raw.config).not.toMatchObject(options)
    expect(doc.options).not.toMatchObject(options)
  }
}

beforeEach(() => {
  jest.resetModules()
})

it('should attach local endpoints when IS_OFFLINE is true', () => {
  testWithOffline()
})

it('should not attach local endpoints when IS_OFFLINE is true', () => {
  testWithOffline()
})
