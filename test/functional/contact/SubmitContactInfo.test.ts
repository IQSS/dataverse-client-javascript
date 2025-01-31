import { ApiConfig, submitContactInfo, ContactDTO, WriteError, Contact } from '../../../src'
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

  test('should return Contact result successfully', async () => {
    const contactDTO: ContactDTO = {
      targetId: 1,
      subject: 'Data Question',
      body: 'Please help me understand your data. Thank you!',
      fromEmail: 'example@gmail.com'
    }

    let contactInfo: Contact[] = []
    try {
      contactInfo = await submitContactInfo.execute(contactDTO)
    } catch (error) {
      throw new Error('Contact info should be submitted')
    } finally {
      expect(contactInfo).toBeDefined()
      expect(contactInfo[0].fromEmail).toEqual('example@gmail.com')
      expect(contactInfo[0].subject).toEqual(expect.any(String))
      expect(contactInfo[0].body).toEqual(expect.any(String))
    }
  })

  test('should return a Contact when targetId is not provided', async () => {
    const contactDTO: ContactDTO = {
      subject: 'General Inquiry',
      body: 'I have a general question.',
      fromEmail: 'example@gmail.com'
    }

    let contactInfo: Contact[] = []
    try {
      contactInfo = await submitContactInfo.execute(contactDTO)
    } catch (error) {
      throw new Error('Contact info should be submitted even if target id is missing')
    } finally {
      expect(contactInfo).toBeDefined()
      expect(contactInfo[0].fromEmail).toEqual('example@gmail.com')
      expect(contactInfo[0].subject).toEqual(expect.any(String))
      expect(contactInfo[0].body).toEqual(expect.any(String))
    }
  })

  test('should return error if the target id is unexisted', async () => {
    const contactDTO: ContactDTO = {
      targetId: 0,
      subject: '',
      body: '',
      fromEmail: 'example@gmail.com'
    }
    const expectedError = new WriteError(`[400] Feedback target object not found.`)
    await expect(submitContactInfo.execute(contactDTO)).rejects.toThrow(expectedError)
  })
})
