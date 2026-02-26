import { WriteError } from '../../../src'
import { IGuestbooksRepository } from '../../../src/guestbooks/domain/repositories/IGuestbooksRepository'
import { AssignDatasetGuestbook } from '../../../src/guestbooks/domain/useCases/AssignDatasetGuestbook'

describe('AssignDatasetGuestbook', () => {
  test('should return undefined when assign a guestbook to a dataset is successful', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.assignDatasetGuestbook = jest.fn().mockResolvedValue(undefined)
    const sut = new AssignDatasetGuestbook(repository)

    const actual = await sut.execute(1, 123)

    expect(repository.assignDatasetGuestbook).toHaveBeenCalledWith(1, 123)
    expect(actual).toBeUndefined()
  })

  test('should throw WriteError when repository raises an error', async () => {
    const repository: IGuestbooksRepository = {} as IGuestbooksRepository
    repository.assignDatasetGuestbook = jest.fn().mockRejectedValue(new WriteError())
    const sut = new AssignDatasetGuestbook(repository)

    await expect(sut.execute(1, 123)).rejects.toThrow(WriteError)
    expect(repository.assignDatasetGuestbook).toHaveBeenCalledWith(1, 123)
  })
})
