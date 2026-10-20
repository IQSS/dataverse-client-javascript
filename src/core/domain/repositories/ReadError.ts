import { RepositoryError, RepositoryErrorDetails } from './RepositoryError'

export class ReadError extends RepositoryError {
  constructor(reason?: string, details?: RepositoryErrorDetails) {
    super('There was an error when reading the resource.', reason, details)
  }
}
