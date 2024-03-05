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
