/* eslint-disable class-methods-use-this */
import { runCLI } from 'jest'

export default class GoPatoDynamoDBJestPlugin {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options

    this.commands = {
      'dynamodb-jest': {
        usage: 'Run unit tests',
        lifecycleEvents: ['testHandler'],
      },
    }

    this.hooks = {
      'before:dynamodb-jest:testHandler': () => this.serverless.pluginManager.run(['dynamodb-local', 'start']),
      'dynamodb-jest:testHandler': this.testHandler.bind(this),
      'after:dynamodb-jest:testHandler': () => this.serverless.pluginManager.run(['dynamodb-local', 'stop']),
    }
  }

  testHandler() {
    Object.assign(process.env, {
      ...this.serverless.service.provider.environment,
      NODE_ENV: 'test',
      IS_OFFLINE: 'true',
    })
    return runCLI(this.options, [this.serverless.config.servicePath])
  }
}
