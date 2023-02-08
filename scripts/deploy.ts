import { MiBtoByte } from './utils'
import environment from './environment'
import { deploy } from './function-service'
import { FunctionConfig } from './types'

const { FUNCTION_ID, SA_ID, DB_SERVICE_URL } = environment

const partial: FunctionConfig = {
  functionId: FUNCTION_ID,
  runtime: 'nodejs16',
  entrypoint: 'index.handler',
  resources: {
    memory: MiBtoByte(256),
  },
  executionTimeout: { seconds: 60 },
  environment: {
    DB_SERVICE_URL,
  },
  serviceAccountId: SA_ID,
}

deploy(partial, 'dist/')
