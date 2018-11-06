/* @flow */
import * as yup from 'yup'

const tablesSchema = yup
  .array()
  .of(
    yup.object().shape({
      config: yup
        .object()
        .shape({
          TableName: yup.string().required(),
          AttributeDefinitions: yup
            .array()
            .of(
              yup.object().shape({
                AttributeName: yup.string().required(),
                AttributeType: yup.string().required(),
              }),
            )
            .required(),
          KeySchema: yup
            .array()
            .of(
              yup.object().shape({
                AttributeName: yup.string().required(),
                KeyType: yup.string().required(),
              }),
            )
            .required(),
          ProvisionedThroughput: yup
            .object()
            .shape({
              ReadCapacityUnits: yup.number().required(),
              WriteCapacityUnits: yup.number().required(),
            })
            .required(),
        })
        .required(),
      seeds: yup.array().of(yup.string()),
    }),
  )
  .required('argument must be an array of tables')

export async function registerTables(input: any) {
  await tablesSchema.validate(input, { strict: true })
  process.env.DYNAMODB_TABLES = JSON.stringify(input)
}

export function getTables() {
  const tables = JSON.parse(process.env.DYNAMODB_TABLES || '[]')

  if (!tables.length) {
    throw new Error('you should call registerTables() before getTables()')
  }

  return tables
}

export function getTable(tableName: string) {
  if (!tableName || typeof tableName !== 'string') {
    throw new Error('tableName must be a string')
  }

  const table = getTables().find(t => t.config.TableName === tableName)

  if (!table) {
    throw new Error(
      `'${tableName}' table not found. Try with: ${getTables()
        .map(t => `'${t.config.TableName}'`)
        .join('|')}`,
    )
  }

  return table
}
