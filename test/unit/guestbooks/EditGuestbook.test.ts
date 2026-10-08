import { WriteError } from '../../../src'
import { EditGuestbookDTO } from '../../../src/guestbooks/domain/dtos/EditGuestbookDTO'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { EditGuestbook } from '../../../src/guestbooks/domain/useCases/EditGuestbook'

describe('EditGuestbook', () => {
  const editGuestbookDTO: EditGuestbookDTO = {
    name: 'my edited guestbook',
    enabled: true,
    emailRequired: true,
    nameRequired: true,
    institutionRequired: false,
    positionRequired: false,
    createTime: '2026-06-12T00:00:00Z',
    customQuestions: [
      {
        id: 1,
        question: "how's your day",
        required: true,
        displayOrder: 0,
        type: 'text',
        hidden: false
      },
      {
        question: 'What color car do you drive',
        required: true,
        displayOrder: 1,
        type: 'options',
        hidden: false,
        optionValues: [
          { id: 10, value: 'Red', displayOrder: 0 },
          { value: 'White', displayOrder: 1 }
        ]
      }
    ]
  }

  test('should edit guestbook', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.editGuestbook = jest.fn().mockResolvedValue(undefined)

    const sut = new EditGuestbook(repository)
    const actual = await sut.execute(123, editGuestbookDTO)

    expect(repository.editGuestbook).toHaveBeenCalledWith(123, editGuestbookDTO)
    expect(actual).toBeUndefined()
  })

  test('should throw WriteError when repository fails', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.editGuestbook = jest.fn().mockRejectedValue(new WriteError())
    const sut = new EditGuestbook(repository)

    await expect(sut.execute(123, editGuestbookDTO)).rejects.toThrow(WriteError)
  })
})
