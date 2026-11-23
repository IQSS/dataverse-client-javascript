export interface RepositoryErrorDetails {
  statusCode?: number
  fieldErrors?: Record<string, string>
}

export abstract class RepositoryError extends Error {
  readonly statusCode?: number
  readonly fieldErrors?: Record<string, string>

  constructor(message: string, reason?: string, details?: RepositoryErrorDetails) {
    if (reason) {
      message += ` Reason was: ${reason}`
    }
    super(message)
    this.statusCode = details?.statusCode
    this.fieldErrors = details?.fieldErrors
  }
}
