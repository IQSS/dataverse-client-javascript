import { WriteError } from '../../../src'
import { CreateGuestbookDTO } from '../../../src/guestbooks/domain/dtos/CreateGuestbookDTO'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { CreateGuestbook } from '../../../src/guestbooks/domain/useCases/CreateGuestbook'

describe('CreateGuestbook', () => {
  const createGuestbookDTO: CreateGuestbookDTO = {
    name: 'my test guestbook',
    enabled: true,
    emailRequired: true,
    nameRequired: true,
    institutionRequired: false,
    positionRequired: false,
    email: 'test@gmail.com',
    institution: 'Harvard University',
    position: 'Researcher',
    customQuestions: [
      {
        question: "how's your day",
        required: true,
        displayOrder: 0,
        type: 'text',
        hidden: false
      },
      {
        question: 'Describe yourself',
        required: false,
        displayOrder: 1,
        type: 'textarea',
        hidden: false
      },
      {
        question: 'What color car do you drive',
        required: true,
        displayOrder: 2,
        type: 'options',
        hidden: false,
        optionValues: [
          { value: 'Red', displayOrder: 0 },
          { value: 'White', displayOrder: 1 },
          { value: 'Yellow', displayOrder: 2 },
          { value: 'Purple', displayOrder: 3 }
        ]
      }
    ]
  }
  const collectionId = 'testCollection'

  test('should create guestbook for collection', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.createGuestbook = jest.fn().mockResolvedValue(undefined)

    const sut = new CreateGuestbook(repository)
    const actual = await sut.execute(createGuestbookDTO, collectionId)

    expect(repository.createGuestbook).toHaveBeenCalledWith(collectionId, createGuestbookDTO)
    expect(actual).toBeUndefined()
  })

  test('should throw WriteError when repository fails', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.createGuestbook = jest.fn().mockRejectedValue(new WriteError())
    const sut = new CreateGuestbook(repository)

    await expect(sut.execute(createGuestbookDTO, collectionId)).rejects.toThrow(WriteError)
  })
})
