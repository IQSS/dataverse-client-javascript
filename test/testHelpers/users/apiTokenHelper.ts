import axios from 'axios'
import { TestConstants } from '../TestConstants'

const CREATE_USER_ENDPOINT = '/builtin-users?key=burrito&password=testuser'
const API_TOKEN_USER_ENDPOINT = '/builtin-users/testuser/api-token'

export const createApiTokenViaApi = async (): Promise<string> => {
  try {
    await axios.post(
      `${TestConstants.TEST_API_URL}${CREATE_USER_ENDPOINT}`,
      JSON.stringify({
        userName: 'testuser',
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com'
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return axios
      .get(`${TestConstants.TEST_API_URL}${API_TOKEN_USER_ENDPOINT}?password=testuser`)
      .then((response) => response.data.data.message)
  } catch (error) {
    throw new Error(`Error while creating API token`)
  }
}
