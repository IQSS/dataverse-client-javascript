import { IUsersRepository } from '../../../src/users/domain/repositories/IUsersRepository'
import { RecreateCurrentApiToken } from '../../../src/users/domain/useCases/RecreateCurrentApiToken'
import { WriteError } from '../../../src'
import { ApiTokenInfo } from '../../../src/users/domain/models/ApiTokenInfo'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('execute', () => {
  test('should return API token on repository success', async () => {
    const testNewTokenInfo: ApiTokenInfo = {
      apiToken: TestConstants.TEST_DUMMY_API_KEY,
      expirationDate: new Date()
    }
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.recreateCurrentApiToken = jest.fn().mockResolvedValue(testNewTokenInfo)
    const sut = new RecreateCurrentApiToken(usersRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toEqual(testNewTokenInfo)
  })

  test('should return error result on repository error', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.recreateCurrentApiToken = jest.fn().mockRejectedValue(new WriteError())
    const sut = new RecreateCurrentApiToken(usersRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(WriteError)
  })
})
