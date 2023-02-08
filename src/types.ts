import { Handler } from '@yandex-cloud/function-types'

export type UserState = {
  emotion: string
  energy: number
  timestamp: number
  timezone: string
}

export enum FileType {
  xlsx = 'xlsx',
  pdf = 'pdf',
}

type HandlerParameters = Parameters<Handler.Http>

type RequestContext = {
  requestContext: {
    authorizer?: {
      userId?: number
    }
  }
}

type Return = {
  statusCode: number
  body: string
}

export type Handler = (
  event: HandlerParameters[0] & RequestContext,
  context: HandlerParameters[1],
) => Promise<Return>

export type Rows = (
  | string
  | number
  | {
      v: number | string
      t: string
      z: string
      cellNF: boolean
    }
  | undefined
)[][]
