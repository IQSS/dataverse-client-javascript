export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public errorMessage: string;
  private value: T;

  private constructor(isSuccess: boolean, errorMessage?: string, value?: T) {
    if (isSuccess && errorMessage) {
      throw new Error('A result cannot be successful and contain an error message');
    }
    if (!isSuccess && !errorMessage) {
      throw new Error('An error result needs to contain an error message');
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.errorMessage = errorMessage;
    this.value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot retrieve the value of an error result');
    }

    return this.value;
  }

  public static success<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static error<U>(errorMessage: string): Result<U> {
    return new Result<U>(false, errorMessage);
  }
}
