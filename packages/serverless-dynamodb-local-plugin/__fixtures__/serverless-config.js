export default {
  service: {
    provider: {
      environment: {},
    },
    custom: {
      dynamodb: {
        seeds: [
          {
            table: 'data-table',
            sources: [
              'packages/serverless-dynamodb-local-utils/__fixtures__/data-table.seed-1.json',
            ],
          },
          {
            table: 'data-table',
            sources: [
              'packages/serverless-dynamodb-local-utils/__fixtures__/data-table.seed-2.json',
            ],
          },
        ],
      },
    },
    resources: {
      Resources: {
        DataTable: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
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
        },
        UsersTable: {
          Type: 'AWS::DynamoDB::Table',
          Properties: {
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
        },
      },
    },
  },
}
