import { ContactRepository } from '../../../src/contactInfo/infra/repositories/ContactRepository'
import { ApiConfig, Contact, ContactDTO, WriteError } from '../../../src'
import { DataverseApiAuthMechanism } from '../../../src/core/infra/repositories/ApiConfig'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('submitContactInfo', () => {
  beforeAll(async () => {
    ApiConfig.init(
      TestConstants.TEST_API_URL,
      DataverseApiAuthMechanism.API_KEY,
      process.env.TEST_API_KEY
    )
  })

  const testContactDTO: ContactDTO = {
    targetId: 6,
    subject: 'Data Question',
    body: 'Please help me understand your data. Thank you!',
    fromEmail: '1314@gmail.com'
  }

  const sut: ContactRepository = new ContactRepository()

  test('should return ContactDTO when contact info is successfully submitted', async () => {
    const collectionAlias = 'collection-1'
    const collectionEmail = 'pi@example.edu,student@example.edu'
    const baseUrl = 'http://localhost:8080/dataverse/'
    const bodyMessage =
      'You have just been sent the following message from ' +
      testContactDTO.fromEmail +
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

    const expectedResponse: Contact[] = [
      {
        fromEmail: testContactDTO.fromEmail,
        toEmail: collectionEmail,
        subject: 'Root contact: ' + testContactDTO.subject,
        body: bodyMessage
      }
    ]
    const actual = await sut.submitContactInfo(testContactDTO)
    expect(actual).toEqual(expectedResponse)
  })

  test('should return error if the target id is unexisted', async () => {
    const invalidContactDTO: ContactDTO = {
      targetId: 0,
      subject: '',
      body: '',
      fromEmail: ''
    }
    const expectedError = new WriteError(`[400] Feedback target object not found`)
    await expect(sut.submitContactInfo(invalidContactDTO)).rejects.toThrow(expectedError)
  })
})
