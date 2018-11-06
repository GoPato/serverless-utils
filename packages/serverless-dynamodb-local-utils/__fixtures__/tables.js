/* @flow */
export default [
  {
    config: {
      TableName: 'data-table',
      AttributeDefinitions: [
        {
          AttributeName: 'dataId',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'dataId',
          KeyType: 'HASH',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
    seeds: [
      'packages/serverless-dynamodb-local-utils/__fixtures__/data-table.seed-1.json',
      'packages/serverless-dynamodb-local-utils/__fixtures__/data-table.seed-2.json',
    ],
  },
  {
    config: {
      TableName: 'users-table',
      AttributeDefinitions: [
        {
          AttributeName: 'userId',
          AttributeType: 'S',
        },
      ],
      KeySchema: [
        {
          AttributeName: 'userId',
          KeyType: 'HASH',
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
    seeds: [],
  },
]
