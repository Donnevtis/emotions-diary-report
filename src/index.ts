import { getStateById } from './api'
import { FileType, Handler } from './types'
import { logger } from './utils'
import xlsx from './xlsx'

const badRequest = (message: string) => ({
  body: JSON.stringify(message),
  statusCode: 400,
})

export const handler: Handler = async ({
  requestContext: { authorizer },
  queryStringParameters,
}) => {
  const fileType = queryStringParameters.type
  const language = queryStringParameters.lang

  if (!fileType) {
    return badRequest('File type not selected')
  }

  const userId = authorizer?.userId

  if (!userId) {
    return badRequest('User ID not found')
  }

  try {
    const userState = await getStateById(userId)

    switch (fileType) {
      case FileType.xlsx: {
        return {
          body: xlsx(userState, language),
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
