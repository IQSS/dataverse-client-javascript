import { WriteError } from '../../../src'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { RemoveDatasetGuestbook } from '../../../src/guestbooks/domain/useCases/RemoveDatasetGuestbook'

describe('removeDatasetGuestbook', () => {
  test('should return undefined when removing guestbook is successful', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.removeDatasetGuestbook = jest.fn().mockResolvedValue(undefined)
    const sut = new RemoveDatasetGuestbook(repository)

    const actual = await sut.execute(1)

    expect(repository.removeDatasetGuestbook).toHaveBeenCalledWith(1)
    expect(actual).toBeUndefined()
  })

  test('should throw WriteError when repository raises an error', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.removeDatasetGuestbook = jest.fn().mockRejectedValue(new WriteError())
    const sut = new RemoveDatasetGuestbook(repository)

    await expect(sut.execute('doi:10.5072/FK2/ABCDEF')).rejects.toThrow(WriteError)
    expect(repository.removeDatasetGuestbook).toHaveBeenCalledWith('doi:10.5072/FK2/ABCDEF')
  })
})
