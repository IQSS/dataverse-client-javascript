export class ResponseUtil {
  public static getErrorMessage(body: string): string {
    let message: string
    try {
      message = JSON.parse(body).message
    }
    catch {
      message = ''
    }

    return message
  }
}