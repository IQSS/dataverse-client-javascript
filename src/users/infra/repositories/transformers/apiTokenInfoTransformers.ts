import { AxiosResponse } from 'axios'
import { ApiTokenInfo } from '../../../domain/models/ApiTokenInfo'

export const transformGetApiTokenResponseToApiTokenInfo = (
  response: AxiosResponse
): ApiTokenInfo => {
  const apiTokenInfoPayload = response.data.data
  const messageParts = apiTokenInfoPayload.message.split(' ')
  const expirationDateFormattedTimestamp = `${messageParts[4]}T${messageParts[5]}`
  return {
    apiToken: messageParts[1],
    expirationDate: new Date(expirationDateFormattedTimestamp)
  }
}

export const transformRecreateApiTokenResponseToApiTokenInfo = (
  response: AxiosResponse
): ApiTokenInfo => {
  const apiTokenInfoPayload = response.data.data
  const messageParts = apiTokenInfoPayload.message.split(' ')
  const expirationDateFormattedTimestamp = `${messageParts[9]}T${messageParts[10]}`
  return {
    apiToken: messageParts[5],
    expirationDate: new Date(expirationDateFormattedTimestamp)
  }
}
