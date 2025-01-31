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
    targetId: 1,
    subject: 'Data Question',
    body: 'Please help me understand your data. Thank you!',
    fromEmail: 'example@gmail.com'
  }

  const sut: ContactRepository = new ContactRepository()

  test('should return Contact when contact info is successfully submitted', async () => {
    const contactInfo = await sut.submitContactInfo(testContactDTO)

    expect(contactInfo).toBeDefined()
    expect(contactInfo[0].fromEmail).toEqual(testContactDTO.fromEmail)
    expect(contactInfo[0].subject).toEqual(expect.any(String))
    expect(contactInfo[0].body).toEqual(expect.any(String))
  })

  test('should return a Contact when targetId is not provided', async () => {
    const contactDTOWithoutTargetId: Partial<ContactDTO> = {
      subject: 'General Inquiry',
      body: 'I have a general question.',
      fromEmail: 'example@gmail.com'
    }

    const contactInfo: Contact[] = await sut.submitContactInfo(
      contactDTOWithoutTargetId as ContactDTO
    )

    expect(contactInfo).toBeDefined()
    expect(contactInfo[0].fromEmail).toEqual(contactDTOWithoutTargetId.fromEmail)
    expect(contactInfo[0].subject).toEqual(expect.any(String))
    expect(contactInfo[0].body).toEqual(expect.any(String))
  })

  test('should return error if the target id is unexisted', async () => {
    const invalidContactDTO: ContactDTO = {
      targetId: 0,
      subject: '',
      body: '',
      fromEmail: ''
    }
    const expectedError = new WriteError(`[400] Feedback target object not found.`)
    await expect(sut.submitContactInfo(invalidContactDTO)).rejects.toThrow(expectedError)
  })
})
