import { Logout } from '../../../src/auth/domain/useCases/Logout'
import { IAuthRepository } from '../../../src/auth/domain/repositories/IAuthRepository'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'

describe('execute', () => {
  test('should not return error on repository success', async () => {
    const authRepositoryStub: IAuthRepository = {} as IAuthRepository
    authRepositoryStub.logout = jest.fn()
    const sut = new Logout(authRepositoryStub)
    await sut.execute()
    expect(authRepositoryStub.logout).toHaveBeenCalled()
  })

  test('should return error result on repository error', async () => {
    const testWriteError = new WriteError()
    const authRepositoryStub: IAuthRepository = {} as IAuthRepository
    authRepositoryStub.logout = jest.fn().mockRejectedValue(testWriteError)
    const sut = new Logout(authRepositoryStub)

    await expect(sut.execute()).rejects.toThrow(testWriteError)
  })
})
