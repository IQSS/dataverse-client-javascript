export class ResponseUtil {
  public static getErrorBody(errorBody: string): string {
    return errorBody ? errorBody : ''
  }
}