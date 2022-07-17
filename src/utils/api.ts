import {NextApiRequest, NextApiResponse} from 'next'
import {ApiResponse} from 'types'

import {isDevelopment} from './env'
import {logging} from './logging'

export function apiAction<Output>(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Output>>,
  type: string,
) {
  return {
    async run<Input>(action: (input: Input) => Promise<Output>) {
      try {
        const input = JSON.parse(req.body) as Input

        logging.info(`running ${type}...`)
        const output = await action(input)

        res.status(200).json(output)
      } catch (error: any) {
        logging.error(type, error)
        const data =
          isDevelopment && error.stack
            ? {...error.data, stack: error.stack}
            : {...error.data}

        res.status(error.statusCode || 500).json({
          error: {
            message: error instanceof Error ? error.message : error.toString(),
            body: req.body,
            ...data,
          },
        })
      }
    },
  }
}

export interface ApiClientOptions {
  data?: any
  method?: 'POST' | 'GET'
}

export type ApiClientResponse<Output> = ApiResponse<{
  status: number
  result: Output
}>

export async function api<Output = unknown>(
  path: string,
  {data, method = 'POST'}: ApiClientOptions = {},
): Promise<ApiClientResponse<Output>> {
  try {
    logging.debug(`Request ${path}`, data)
    const res = await fetch(`/api/${path}`, {
      method,
      body: data && JSON.stringify(data),
    })
    const result = await res.json()
    logging.debug(`Response ${path}`, result)

    const {status} = res

    if (status >= 400 || result.error) {
      const {message, ...error} = result.error
      logging.error(`Error: ${message}`, error)
    }

    return {status, result}
  } catch (error: any) {
    logging.error(error.toString(), {error})
    return {error}
  }
}
