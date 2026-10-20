import { GetOrcidSignUpAuthorizationUrl } from '../../../src/users/domain/useCases/GetOrcidSignUpAuthorizationUrl'
import { IUsersRepository } from '../../../src/users/domain/repositories/IUsersRepository'
import { ReadError } from '../../../src'

describe('execute', () => {
  const redirectUri = 'http://127.0.0.1:8000/spa/sign-up'

  test('should return the authorization URL on repository success', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.getOrcidSignUpAuthorizationUrl = jest
      .fn()
      .mockResolvedValue('https://orcid.org/oauth/authorize?client_id=APP-1')
    const sut = new GetOrcidSignUpAuthorizationUrl(usersRepositoryStub)

    const actual = await sut.execute(redirectUri)

    expect(usersRepositoryStub.getOrcidSignUpAuthorizationUrl).toHaveBeenCalledWith(redirectUri)
    expect(actual).toBe('https://orcid.org/oauth/authorize?client_id=APP-1')
  })

  test('should return error result on repository error', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.getOrcidSignUpAuthorizationUrl = jest
      .fn()
      .mockRejectedValue(new ReadError())
    const sut = new GetOrcidSignUpAuthorizationUrl(usersRepositoryStub)

    await expect(sut.execute(redirectUri)).rejects.toThrow(ReadError)
  })
})
