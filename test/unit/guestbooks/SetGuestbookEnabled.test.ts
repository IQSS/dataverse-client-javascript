import { WriteError } from '../../../src'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { SetGuestbookEnabled } from '../../../src/guestbooks/domain/useCases/SetGuestbookEnabled'

describe('execute', () => {
  test('should set enabled status', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.setGuestbookEnabled = jest.fn().mockResolvedValue(undefined)
    const sut = new SetGuestbookEnabled(repository)

    const actual = await sut.execute('collectionAlias', 12, false)

    expect(repository.setGuestbookEnabled).toHaveBeenCalledWith('collectionAlias', 12, false)
    expect(actual).toBeUndefined()
  })

  test('should throw WriteError when repository fails', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.setGuestbookEnabled = jest.fn().mockRejectedValue(new WriteError())
    const sut = new SetGuestbookEnabled(repository)

    await expect(sut.execute('collectionAlias', 999, true)).rejects.toThrow(WriteError)
  })
})
