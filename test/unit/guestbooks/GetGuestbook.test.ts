import { ReadError } from '../../../src'
import { Guestbook } from '../../../src/guestbooks/domain/models/Guestbook'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { GetGuestbook } from '../../../src/guestbooks/domain/useCases/GetGuestbook'

describe('execute', () => {
  const guestbook: Guestbook = {
    id: 12,
    name: 'test',
    enabled: true,
    emailRequired: true,
    nameRequired: true,
    institutionRequired: false,
    positionRequired: false,
    customQuestions: [],
    createTime: '2024-01-01T00:00:00Z',
    dataverseId: 34
  }

  test('should return guestbook', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbook = jest.fn().mockResolvedValue(guestbook)

    const sut = new GetGuestbook(repository)
    const actual = await sut.execute(12)

    expect(repository.getGuestbook).toHaveBeenCalledWith(12)
    expect(actual).toEqual(guestbook)
  })

  test('should throw ReadError when repository fails', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.getGuestbook = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetGuestbook(repository)

    await expect(sut.execute(111111)).rejects.toThrow(ReadError)
  })
})
