import { ConnectOrcidForSignUp } from '../../../src/users/domain/useCases/ConnectOrcidForSignUp'
import { IUsersRepository } from '../../../src/users/domain/repositories/IUsersRepository'
import { OrcidSignUpCallbackDTO, OrcidSignUpConnection, WriteError } from '../../../src'

describe('execute', () => {
  const callback: OrcidSignUpCallbackDTO = {
    code: 'orcid-code',
    state: 'orcid-state',
    redirectUri: 'http://127.0.0.1:8000/spa/sign-up'
  }

  test('should return the ORCID connection on repository success', async () => {
    const connection: OrcidSignUpConnection = {
      orcid: 'https://orcid.org/0000-0002-1825-0097',
      orcidToken: 'orcid-token',
      firstName: 'Josiah'
    }
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.connectOrcidForSignUp = jest.fn().mockResolvedValue(connection)
    const sut = new ConnectOrcidForSignUp(usersRepositoryStub)

    const actual = await sut.execute(callback)

    expect(usersRepositoryStub.connectOrcidForSignUp).toHaveBeenCalledWith(callback)
    expect(actual).toEqual(connection)
  })

  test('should return error result on repository error', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.connectOrcidForSignUp = jest.fn().mockRejectedValue(new WriteError())
    const sut = new ConnectOrcidForSignUp(usersRepositoryStub)

    await expect(sut.execute(callback)).rejects.toThrow(WriteError)
  })
})
