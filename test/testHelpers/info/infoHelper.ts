import axios, { AxiosResponse } from 'axios'
import { TestConstants } from '../TestConstants'

export const setMaxEmbargoDurationInMonthsViaApi = async (
  maxEmbargoDurationInMonths: number
): Promise<AxiosResponse> => {
  return await axios.put(
    `${TestConstants.TEST_API_URL}/admin/settings/:MaxEmbargoDurationInMonths`,
    maxEmbargoDurationInMonths.toString(),
    {
      headers: { 'Content-Type': 'text/plain' }
    }
  )
}

export const setApplicationTermsOfUseViaApi = async (
  applicationTermsOfUse: string
): Promise<AxiosResponse> => {
  return await axios.put(
    `${TestConstants.TEST_API_URL}/admin/settings/:ApplicationTermsOfUse`,
    applicationTermsOfUse,
    {
      headers: { 'Content-Type': 'text/plain' }
    }
  )
}
export const setDatasetPublishPopupCustomTextViaApi = async (
  datasetPublishPopupCustomText: string
): Promise<AxiosResponse> => {
  return await axios.put(
    `${TestConstants.TEST_API_URL}/admin/settings/:DatasetPublishPopupCustomText`,
    datasetPublishPopupCustomText,
    {
      headers: { 'Content-Type': 'text/plain' }
    }
  )
}
export const setPublishDatasetDisclaimerTextViaApi = async (
  publishDatasetDisclaimerText: string
): Promise<AxiosResponse> => {
  return await axios.put(
    `${TestConstants.TEST_API_URL}/admin/settings/:PublishDatasetDisclaimerText`,
    publishDatasetDisclaimerText,
    {
      headers: { 'Content-Type': 'text/plain' }
    }
  )
}
export const deleteApplicationTermsOfUseViaApi = async (): Promise<AxiosResponse> => {
  return await axios.delete(`${TestConstants.TEST_API_URL}/admin/settings/:ApplicationTermsOfUse`)
}
