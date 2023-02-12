import { UserState } from '../types'
import { errorHandler } from '../utils'
import { QueryCommand, QueryOutput } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'
import dynamodb from './client'

const dbErrorHandler = errorHandler('Database exception')

export const getStateById = async (
  id: string | number,
  start = '0',
  end = Date.now().toString(),
  ExclusiveStartKey?: QueryOutput['LastEvaluatedKey'],
) => {
  try {
    const input = new QueryCommand({
      TableName: 'Users',
      KeyConditionExpression: 'PK = :pk and SK BETWEEN :start AND :end',
      ExpressionAttributeValues: marshall({
        ':pk': `user#${id}#state`,
        ':start': start,
        ':end': end,
      }),
      ProjectionExpression: 'state_id, emotion, energy, timestamp, timezone',
      ScanIndexForward: false,
      ExclusiveStartKey,
    })

    const { Items, LastEvaluatedKey } = await dynamodb.send(input)

    const states = Items?.length
      ? (Items.map(emotion => unmarshall(emotion)) as UserState[])
      : []

    if (LastEvaluatedKey) {
      const recursionStates = await getStateById(
        id,
        start,
        end,
        LastEvaluatedKey,
      )
      if (recursionStates) {
        states?.push(...recursionStates)
      }
    }

    return states
  } catch (error) {
    dbErrorHandler(error, getStateById.name, {
      id,
    })

    return []
  }
}
