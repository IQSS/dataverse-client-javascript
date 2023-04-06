export class ReadError extends Error {
  constructor(reason?: string) {
    let message = 'There was an error when reading the resource.';
    if (reason) {
      message += ' Reason was: ' + reason;
    }
    super(message);
  }
}
