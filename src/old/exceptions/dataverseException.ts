export class DataverseException extends Error {
  public readonly errorCode: number;

  constructor(errorCode: number, message?: string) {
    super(message);
    this.errorCode = errorCode;
  }
}
