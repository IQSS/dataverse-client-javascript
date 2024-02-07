import { Logout } from '../../../src/auth/domain/useCases/Logout'
import { assert, createSandbox, SinonSandbox } from 'sinon'
import { IAuthRepository } from '../../../src/auth/domain/repositories/IAuthRepository'
import { WriteError } from '../../../src/core/domain/repositories/WriteError'

describe('execute', () => {
  const sandbox: SinonSandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  test('should not return error on repository success', async () => {
    const authRepositoryMock = <IAuthRepository>{}
    authRepositoryMock.logout = sandbox.mock()
    const sut = new Logout(authRepositoryMock)
    await sut.execute()
  })

  test('should return error result on repository error', async () => {
    const authRepositoryStub = <IAuthRepository>{}
    const testWriteError = new WriteError()
    authRepositoryStub.logout = sandbox.stub().throwsException(testWriteError)
    const sut = new Logout(authRepositoryStub)

    let actualError: WriteError = undefined
    await sut.execute().catch((e) => (actualError = e))

    assert.match(actualError, testWriteError)
  })
})
