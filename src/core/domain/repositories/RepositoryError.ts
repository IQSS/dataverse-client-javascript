export abstract class RepositoryError extends Error {
  constructor(message: string, reason?: string) {
    if (reason) {
      message += ` Reason was: ${reason}`;
    }
    super(message);
  }
}
