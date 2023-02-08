import { UserState } from './types'
import { errorHandler } from './utils'
import fetch, { Response } from 'node-fetch'

const apiErrorHandler = errorHandler('Api exception')
const createUrlWithId = (id: number) => {
  const url = new URL(String(process.env.DB_SERVICE_URL))
  url.searchParams.append('user_id', String(id))

  return url
}
const responeHandler = async (res: Response) => {
  if (res.status !== 200) {
    throw new Error('Server error', { cause: await res.text() })
  }

  return res.json()
}

export const getStateById = (id: number): Promise<UserState[]> =>
  fetch(createUrlWithId(id), {
    method: 'GET',
  })
    .then(responeHandler)
    .catch(error => apiErrorHandler(error, getStateById.name, { id }))
