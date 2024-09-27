import axios from 'axios'
import { TestConstants } from '../TestConstants'

export const createApiTokenViaApi = async (userName: string): Promise<string> => {
  try {
    await axios.post(
      `${TestConstants.TEST_API_URL}/builtin-users?key=burrito&password=${userName}`,
      JSON.stringify({
        userName: userName,
        firstName: 'John',
        lastName: 'Doe',
        email: `${userName}@test.com`
      }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return axios
      .get(`${TestConstants.TEST_API_URL}/builtin-users/${userName}/api-token?password=${userName}`)
      .then((response) => response.data.data.message)
  } catch (error) {
    console.log(error)
    throw new Error(`Error while creating API token`)
  }
}
