import { SignUp } from '../../../src/users/domain/useCases/SignUp'
import { IUsersRepository } from '../../../src/users/domain/repositories/IUsersRepository'
import { SignUpDTO, WriteError } from '../../../src'

describe('execute', () => {
  const testSignUpDTO: SignUpDTO = {
    username: 'alovelace',
    firstName: 'Ada',
    lastName: 'Lovelace',
    emailAddress: 'ada@example.edu',
    password: 'Str0ngPassw0rd',
    termsAccepted: true
  }

  test('should return the sign-up result on repository success', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.signUp = jest
      .fn()
      .mockResolvedValue({ status: 'created', identifier: '@alovelace' })
    const sut = new SignUp(usersRepositoryStub)

    const actual = await sut.execute(testSignUpDTO)

    expect(usersRepositoryStub.signUp).toHaveBeenCalledWith(testSignUpDTO)
    expect(actual).toEqual({ status: 'created', identifier: '@alovelace' })
  })

  test('should return error result on repository error', async () => {
    const usersRepositoryStub: IUsersRepository = {} as IUsersRepository
    usersRepositoryStub.signUp = jest.fn().mockRejectedValue(new WriteError())
    const sut = new SignUp(usersRepositoryStub)

    await expect(sut.execute(testSignUpDTO)).rejects.toThrow(WriteError)
  })
})
