import { RepositoryError, RepositoryErrorDetails } from './RepositoryError'

export class WriteError extends RepositoryError {
  constructor(reason?: string, details?: RepositoryErrorDetails) {
    super('There was an error when writing the resource.', reason, details)
  }
}
