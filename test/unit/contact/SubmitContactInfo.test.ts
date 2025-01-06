import { WriteError, Contact, ContactDTO } from '../../../src'
import { SubmitContactInfo } from '../../../src/contactInfo/domain/useCases/SubmitContactInfo'
import { IContactRepository } from '../../../src/contactInfo/domain/repositories/IContactRepository'

describe('execute submit information to contacts', () => {
  test('should return a Contact when repository call is successful', async () => {
    const fromEmail = '1314@gmail.com'

    const contactDTO: ContactDTO = {
      targetId: 6,
      subject: 'Data Question',
      body: 'Please help me understand your data. Thank you!',
      fromEmail: fromEmail
    }

    const collectionAlias = 'collection-1'
    const collectionEmail = 'pi@example.edu,student@example.edu'
    const baseUrl = 'http://localhost:8080/dataverse/'
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

    const expectedResponse: Contact[] = [
      {
        fromEmail: contactDTO.fromEmail,
        toEmail: collectionEmail,
        subject: 'Root contact: ' + contactDTO.subject,
        body: bodyMessage
      }
    ]

    const contactRepositoryStub = <IContactRepository>{}

    contactRepositoryStub.submitContactInfo = jest.fn().mockResolvedValue(expectedResponse)
    const sut = new SubmitContactInfo(contactRepositoryStub)
    const actual = await sut.execute(contactDTO)
    expect(actual).toEqual(expectedResponse)
    expect(contactRepositoryStub.submitContactInfo).toHaveBeenCalledWith(contactDTO)
  })

  test('should return error result on error response', async () => {
    const contactDTO: ContactDTO = {
      targetId: 0,
      subject: '',
      body: '',
      fromEmail: ''
    }
    const contactRepositoryStub = <IContactRepository>{}
    const error = new WriteError(`[400] Feedback target object not found`)
    contactRepositoryStub.submitContactInfo = jest.fn().mockRejectedValue(error)
    const sut = new SubmitContactInfo(contactRepositoryStub)
    await expect(sut.execute(contactDTO)).rejects.toThrow(error)
    expect(contactRepositoryStub.submitContactInfo).toHaveBeenCalledWith(contactDTO)
  })
})
