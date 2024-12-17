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
    const collectionAlias = 'collection-1'
    const collectionEmail = 'pi@example.edu,student@example.edu'
    const baseUrl = 'http://localhost:8080/dataverse/'

    const contactDTO: ContactDTO = {
      targetId: 6,
      subject: subject,
      body: 'Please help me understand your data. Thank you!',
      fromEmail: fromEmail
    }

    const bodyMessage =
      'You have just been sent the following message from ' +
      fromEmail +
      ' via the Root hosted dataverse named "' +
      collectionAlias +
      '":\n' +
      '\n' +
      '---\n' +
      '\n' +
      'Please help me understand your data. Thank you!\n' +
      '\n' +
      '---\n' +
      '\n' +
      'Root Support\n' +
      'null\n' +
      '\n' +
      'Go to dataverse ' +
      baseUrl +
      collectionAlias +
      '\n' +
      '\n' +
      'You received this email because you have been listed as a contact for the dataverse. If you believe this was an error, please contact Root Support at null. To respond directly to the individual who sent the message, simply reply to this email.'

    const expectedResponse = [
      {
        fromEmail: fromEmail,
        toEmail: collectionEmail,
        subject: 'Root contact: ' + subject,
        body: bodyMessage
      }
    ]

    let contactInfo
    try {
      contactInfo = await submitContactInfo.execute(contactDTO)
    } catch (error) {
      throw new Error('Contact info should be submitted')
    } finally {
      expect(contactInfo).toEqual(expectedResponse)
    }
  })

  test('should return error if the target id is unexisted', async () => {
    const contactDTO: ContactDTO = {
      targetId: 0, // non-existent target id
      subject: '',
      body: '',
      fromEmail: '1314@gmail.com'
    }
    const expectedError = new WriteError(`[400] Feedback target object not found`)
    await expect(submitContactInfo.execute(contactDTO)).rejects.toThrow(expectedError)
  })
})
