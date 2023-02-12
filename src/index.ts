import { sendFile } from './bot'
import { getStateById } from './database/api'
import { FileType, Handler } from './types'
import { logger } from './utils'
import xlsx from './xlsx'

const badRequest = (message: string) => ({
  body: JSON.stringify(message),
  statusCode: 400,
})

export const handler: Handler = async ({
  requestContext: { authorizer, apiGateway },
  queryStringParameters,
}) => {
  const fileType = queryStringParameters.type
  const language = queryStringParameters.lang
  const start = queryStringParameters.start
  const end = queryStringParameters.end

  if (!fileType) {
    return badRequest('File type not selected')
  }

  const userId = authorizer?.userId || apiGateway?.operationContext?.user_id

  if (!userId) {
    return badRequest('User ID not found')
  }

  try {
    const userState = await getStateById(userId, start, end)

    switch (fileType) {
      case FileType.xlsx: {
        await sendFile(userId, await xlsx(userState, language))

        return {
          body: 'ok',
          statusCode: 200,
          isBase64Encoded: true,
        }
      }
      case FileType.pdf: {
        return badRequest('PDF not supports yet')
      }
      default: {
        return badRequest('File type not supports')
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(JSON.stringify(error.cause))

      return badRequest(error.message)
    }
    throw error
  }
}
