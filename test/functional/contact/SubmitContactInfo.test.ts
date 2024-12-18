import { ApiConfig, submitContactInfo, ContactDTO, WriteError } from '../../../src'
import { TestConstants } from '../../testHelpers/TestConstants'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'

describe('submitContactInfo', () => {
  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  test('should return success result on repository success', async () => {
    const subject = 'Data Question'
    const fromEmail = '1314@gmail.com'

    const contactDTO: ContactDTO = {
      targetId: 1,
      subject: subject,
      body: 'Please help me understand your data. Thank you!',
      fromEmail: fromEmail
    }

    let contactInfo
    try {
      contactInfo = await submitContactInfo.execute(contactDTO)
    } catch (error) {
      throw new Error('Contact info should be submitted')
    } finally {
      expect(contactInfo).toBeDefined()
      expect(contactInfo[0].fromEmail).toEqual(fromEmail)
      expect(contactInfo[0].subject).toEqual(expect.any(String))
      expect(contactInfo[0].body).toEqual(expect.any(String))
      expect(contactInfo[0].toEmail).toEqual(expect.any(String))
    }
  })

  test('should return error if the target id is unexisted', async () => {
    const contactDTO: ContactDTO = {
      targetId: 0,
      subject: '',
      body: '',
      fromEmail: '1314@gmail.com'
    }
    const expectedError = new WriteError(`[400] Feedback target object not found`)
    await expect(submitContactInfo.execute(contactDTO)).rejects.toThrow(expectedError)
  })
})
