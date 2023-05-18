import { RepositoryError } from './RepositoryError';

export class MissingParameterError extends RepositoryError {
  constructor(reason?: string) {
    super('Missing parameter when performing repository operation', reason);
  }
}
