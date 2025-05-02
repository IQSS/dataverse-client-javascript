import axios from 'axios'
import { TestConstants } from '../TestConstants'

export const createApiTokenViaApi = async (
  userName: string,
  createSuperUser = false
): Promise<string> => {
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
    const token = await axios
      .get(`${TestConstants.TEST_API_URL}/builtin-users/${userName}/api-token?password=${userName}`)
      .then((response) => response.data.data.message)
    if (createSuperUser) {
      await axios.put(`${TestConstants.TEST_API_URL}/admin/superuser/${userName}`, 'true')
    }
    return token
  } catch (error: Error | any) {
    console.log(error.message)

    throw new Error(`Error while creating API token`)
  }
}
