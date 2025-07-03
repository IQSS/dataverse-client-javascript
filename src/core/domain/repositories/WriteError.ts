import { RepositoryError } from './RepositoryError'

export class WriteError extends RepositoryError {
  constructor(reason?: string) {
    super('There was an error when writing the resource.', reason)
  }
}
