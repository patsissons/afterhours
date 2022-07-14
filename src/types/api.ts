export type ApiResponse<Value> = Value | {error: unknown}

export interface ApiErrorOptions {
  statusCode?: number
  data?: unknown
}

export class ApiError extends Error {
  constructor(message: string, public readonly options?: ApiErrorOptions) {
    super(message)
  }
}
