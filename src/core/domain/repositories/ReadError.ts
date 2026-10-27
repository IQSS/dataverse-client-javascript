import { RepositoryError } from './RepositoryError'

export class ReadError extends RepositoryError {
  constructor(reason?: string) {
    super('There was an error when reading the resource.', reason)
  }
}
