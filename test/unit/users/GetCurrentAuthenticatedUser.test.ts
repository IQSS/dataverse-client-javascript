import { GetCurrentAuthenticatedUser } from '../../../src/users/domain/useCases/GetCurrentAuthenticatedUser'
import { IUsersRepository } from '../../../src/users/domain/repositories/IUsersRepository'
import { ReadError } from '../../../src/core/domain/repositories/ReadError'
import { createAuthenticatedUser } from '../../testHelpers/users/authenticatedUserHelper'

describe('execute', () => {
  test('should return successful result with authenticated user on repository success', async () => {
    const testAuthenticatedUser = createAuthenticatedUser()
    const usersRepositoryStub: IUsersRepository = {
      getCurrentAuthenticatedUser: jest.fn().mockReturnValue(testAuthenticatedUser)
    }
    const sut = new GetCurrentAuthenticatedUser(usersRepositoryStub)

    const actual = await sut.execute()

    expect(actual).toEqual(testAuthenticatedUser)
  })

  test('should return error result on repository error', async () => {
    const usersRepositoryStub: IUsersRepository = {
      getCurrentAuthenticatedUser: jest.fn().mockRejectedValue(new ReadError())
    }
    const sut = new GetCurrentAuthenticatedUser(usersRepositoryStub)

    let actualError: ReadError = undefined
    await sut.execute().catch((e) => (actualError = e))

    expect(actualError).toBeInstanceOf(ReadError)
  })
})
