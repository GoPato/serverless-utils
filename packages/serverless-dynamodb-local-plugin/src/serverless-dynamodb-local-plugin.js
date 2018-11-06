/* eslint-disable class-methods-use-this */
import {
 start, registerTables, setupTable, stop,
} from '@gopato/serverless-dynamodb-local-utils'

export default class GoPatoDynamoDBLocalPlugin {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options

    this.commands = {
      'dynamodb-local': {
        commands: {
          install: {
            lifecycleEvents: ['installHandler'],
          },
          start: {
            lifecycleEvents: ['startHandler', 'migrateHandler'],
          },
          stop: {
            lifecycleEvents: ['stopHandler'],
          },
        },
      },
    }

    this.hooks = {
      'dynamodb-local:install:installHandler': this.startHandler.bind(this),
      'after:dynamodb-local:install:installHandler': this.stopHandler.bind(this),
      'dynamodb-local:start:startHandler': this.startHandler.bind(this),
      'dynamodb-local:start:migrateHandler': this.migrateHandler.bind(this),
      'dynamodb-local:stop:stopHandler': this.stopHandler.bind(this),
    }
  }

  log(message) {
    this.serverless.cli.log(`[dynamodb-local-plugin]: ${message}`)
  }

  validateDynamoDBConfig() {
    if (!this.serverless.service.custom.dynamodb) {
      throw new Error('dynamodb config not found on serverless.custom')
    }

    if (!this.serverless.service.resources) {
      throw new Error('serverless.resources not found')
    }

    if (!this.serverless.service.resources.Resources) {
      throw new Error('serverless.resources.Resources not found')
    }

    if (
      !Object.values(this.serverless.service.resources.Resources).filter(
        resource => resource.Type === 'AWS::DynamoDB::Table',
      ).length
    ) {
      throw new Error('could not find any AWS::DynamoDB::Table on serverless.resources.Resources')
    }
  }

  get dynamodbTables() {
    return Object.values(this.serverless.service.resources.Resources)
      .filter(({ Type }) => Type === 'AWS::DynamoDB::Table')
      .map(({ Properties: config }) => ({
        config,
        seeds: this.serverless.service.custom.dynamodb.seeds
          .filter(s => s.table === config.TableName)
          .map(s => s.sources)
          .reduce((acc, curr) => [...acc, ...curr], []),
      }))
  }

  async startHandler() {
    this.validateDynamoDBConfig()
    await registerTables(this.dynamodbTables)
    return start()
  }

  async migrateHandler() {
    if (!this.options.migrate) {
      return false
    }

    return Promise.all(this.dynamodbTables.map(table => setupTable(table.config.TableName, true)))
  }

  stopHandler() {
    return stop()
  }
}
