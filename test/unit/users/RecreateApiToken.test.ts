import { IUsersRepository } from '../../../src/users/domain/repositories/IUsersRepository'
import { RecreateApiToken } from '../../../src/users/domain/useCases/RecreateApiToken'
import { WriteError } from '../../../src'

describe('execute', () => {
  test('should return API token on repository success', async () => {
    const testNewToken = 'newToken'
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.recreateApiToken = jest.fn().mockResolvedValue(testNewToken)
    const sut = new RecreateApiToken(usersRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toEqual(testNewToken)
  })

  test('should return error result on repository error', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.recreateApiToken = jest.fn().mockRejectedValue(new WriteError())
    const sut = new RecreateApiToken(usersRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(WriteError)
  })
})
