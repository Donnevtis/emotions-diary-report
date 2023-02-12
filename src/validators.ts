import Ajv, { JSONSchemaType } from 'ajv'
import { UserState } from './types'

const ajv = new Ajv()

const stateSchema: JSONSchemaType<UserState> = {
  type: 'object',
  properties: {
    emotion: { type: 'string' },
    energy: { type: 'number' },
    timestamp: { type: 'number' },
    timezone: { type: 'string' },
  },
  required: ['emotion', 'timestamp', 'energy'],
}

export const validateState = ajv.compile(stateSchema)
