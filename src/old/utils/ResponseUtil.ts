export class ResponseUtil {
  public static getErrorMessage(errorBody: string): string {
    let message: string
    try {
      message = JSON.parse(errorBody).message
    }
    catch {
      message = ''
    }

    return message
  }
}