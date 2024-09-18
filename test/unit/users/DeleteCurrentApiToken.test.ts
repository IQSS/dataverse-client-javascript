import { IUsersRepository } from '../../../src/users/domain/repositories/IUsersRepository'
import { WriteError } from '../../../src'
import { DeleteCurrentApiToken } from '../../../src/users/domain/useCases/DeleteCurrentApiToken'

describe('execute', () => {
  test('should return undefined on repository success', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.deleteCurrentApiToken = jest.fn().mockResolvedValue(undefined)
    const sut = new DeleteCurrentApiToken(usersRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toBeUndefined()
  })

  test('should return error result on repository error', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.deleteCurrentApiToken = jest.fn().mockRejectedValue(new WriteError())
    const sut = new DeleteCurrentApiToken(usersRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(WriteError)
  })
})
