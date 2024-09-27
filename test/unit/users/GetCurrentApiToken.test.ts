import { ReadError } from '../../../src'
import { IUsersRepository } from '../../../src/users/domain/repositories/IUsersRepository'
import { GetCurrentApiToken } from '../../../src/users/domain/useCases/GetCurrentApiToken'
import { TestConstants } from '../../testHelpers/TestConstants'

describe('execute', () => {
  test('should return API token on repository success', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.getCurrentApiToken = jest
      .fn()
      .mockResolvedValue(TestConstants.TEST_DUMMY_API_KEY)
    const sut = new GetCurrentApiToken(usersRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toEqual(TestConstants.TEST_DUMMY_API_KEY)
  })

  test('should return error result on repository error', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.getCurrentApiToken = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetCurrentApiToken(usersRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(ReadError)
  })
})
