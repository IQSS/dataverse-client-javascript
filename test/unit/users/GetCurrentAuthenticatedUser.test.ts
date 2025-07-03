import { GetCurrentAuthenticatedUser } from '../../../src/users/domain/useCases/GetCurrentAuthenticatedUser'
import { IUsersRepository } from '../../../src/users/domain/repositories/IUsersRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { createAuthenticatedUser } from '../../testHelpers/users/authenticatedUserHelper'

describe('execute', () => {
  test('should return successful result with authenticated user on repository success', async () => {
    const testAuthenticatedUser = createAuthenticatedUser()
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.getCurrentAuthenticatedUser = jest
      .fn()
      .mockResolvedValue(testAuthenticatedUser)
    const sut = new GetCurrentAuthenticatedUser(usersRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toEqual(testAuthenticatedUser)
  })

  test('should return error result on repository error', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.getCurrentAuthenticatedUser = jest.fn().mockRejectedValue(new ReadError())
    const sut = new GetCurrentAuthenticatedUser(usersRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(ReadError)
  })
})
